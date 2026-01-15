set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(pwd)}"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="$REPO_ROOT/merge_sync_${STAMP}.log"

echo "== merge+sync start $STAMP ==" | tee "$LOG"

find "$REPO_ROOT" -maxdepth 3 -type d -name ".git" -print0 | while IFS= read -r -d '' GITDIR; do
  REPO="$(dirname "$GITDIR")"
  echo "" | tee -a "$LOG"
  echo "===== REPO: $REPO =====" | tee -a "$LOG"

  cd "$REPO"

  # Basic sanity
  git rev-parse --is-inside-work-tree >/dev/null

  # Capture state
  BEFORE_SHA="$(git rev-parse HEAD || true)"
  echo "BEFORE_HEAD=$BEFORE_SHA" | tee -a "$LOG"

  # Fetch all remotes/tags
  git fetch --all --prune --tags | tee -a "$LOG" || true

  # Determine default branch from origin
  DEFAULT_BRANCH="$(git remote show origin 2>/dev/null | sed -n 's/  HEAD branch: //p' | tr -d '\r')"
  if [ -z "${DEFAULT_BRANCH:-}" ]; then
    # fallback heuristic
    if git show-ref --verify --quiet refs/remotes/origin/main; then DEFAULT_BRANCH="main";
    elif git show-ref --verify --quiet refs/remotes/origin/master; then DEFAULT_BRANCH="master";
    else
      echo "SKIP: cannot determine origin default branch" | tee -a "$LOG"
      continue
    fi
  fi
  echo "DEFAULT_BRANCH=$DEFAULT_BRANCH" | tee -a "$LOG"

  # If dirty, stash (including untracked)
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git stash push -u -m "autostash/${STAMP}" | tee -a "$LOG" || true
    echo "STASHED=1" | tee -a "$LOG"
  else
    echo "STASHED=0" | tee -a "$LOG"
  fi

  # Create a local backup branch pointer (never pushed unless needed)
  git branch -f "backup/${STAMP}" HEAD | tee -a "$LOG" || true

  # Checkout default branch (create if missing)
  if git show-ref --verify --quiet "refs/heads/${DEFAULT_BRANCH}"; then
    git checkout "${DEFAULT_BRANCH}" | tee -a "$LOG"
  else
    git checkout -b "${DEFAULT_BRANCH}" "origin/${DEFAULT_BRANCH}" | tee -a "$LOG"
  fi

  # Sync with origin/default:
  # Try rebase for linear history; if conflict -> abort and do a merge commit
  set +e
  git pull --rebase --autostash origin "${DEFAULT_BRANCH}" 2>&1 | tee -a "$LOG"
  REBASE_RC="${PIPESTATUS[0]}"
  set -e

  if [ "$REBASE_RC" -ne 0 ]; then
    echo "REBASE_FAILED=1 -> aborting rebase and doing merge commit" | tee -a "$LOG"
    git rebase --abort | tee -a "$LOG" || true
    git fetch origin | tee -a "$LOG" || true
    git merge --no-edit "origin/${DEFAULT_BRANCH}" | tee -a "$LOG"
  else
    echo "REBASE_FAILED=0" | tee -a "$LOG"
  fi

  # Push default branch + tags
  git push origin "${DEFAULT_BRANCH}" | tee -a "$LOG"
  git push origin --tags | tee -a "$LOG" || true

  # Push ALL local branches to origin (no deletes)
  for BR in $(git for-each-ref --format='%(refname:short)' refs/heads/); do
    git push -u origin "$BR" | tee -a "$LOG" || true
  done

  # Ensure local has tracking branches for all origin branches (no checkout needed)
  for RBR in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin/ | sed 's|^origin/||' | grep -v '^HEAD$'); do
    if ! git show-ref --verify --quiet "refs/heads/${RBR}"; then
      git branch --track "${RBR}" "origin/${RBR}" | tee -a "$LOG" || true
    fi
  done

  AFTER_SHA="$(git rev-parse HEAD || true)"
  echo "AFTER_HEAD=$AFTER_SHA" | tee -a "$LOG"

done

echo "" | tee -a "$LOG"
echo "== merge+sync complete $STAMP ==" | tee -a "$LOG"
echo "LOG_FILE=$LOG"
