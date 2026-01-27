#!/bin/bash
REPO_ROOT="${REPO_ROOT:-$(pwd)}"
echo "== AUDIT START =="

if [ -f "$REPO_ROOT/scripts/guard_no_env_files.sh" ]; then
  bash "$REPO_ROOT/scripts/guard_no_env_files.sh"
fi

find "$REPO_ROOT" -maxdepth 3 -type d -name ".git" -print0 | while IFS= read -r -d '' GITDIR; do
  REPO="$(dirname "$GITDIR")"
  echo ""
  echo "===== REPO: $(basename "$REPO") ====="
  cd "$REPO"
  
  # Check for uncommitted modifications
  if ! git diff --quiet; then
    echo "[!] Modified files (not staged):"
    git diff --name-only | sed 's/^/    /'
  fi
  
  # Check for staged but uncommitted
  if ! git diff --cached --quiet; then
    echo "[!] Staged files (not committed):"
    git diff --cached --name-only | sed 's/^/    /'
  fi
  
  # Check for untracked files
  if [ -n "$(git ls-files --others --exclude-standard)" ]; then
    echo "[!] Untracked files:"
    git ls-files --others --exclude-standard | head -n 10 | sed 's/^/    /'
    if [ "$(git ls-files --others --exclude-standard | wc -l)" -gt 10 ]; then
        echo "    ... (and more)"
    fi
  fi
  
  # Check for stashes
  if git stash list | grep -q .; then
    echo "[!] Stashes found:"
    git stash list | sed 's/^/    /'
  fi

  # Check for commits not pushed
  DEFAULT="$(git remote show origin 2>/dev/null | sed -n 's/  HEAD branch: //p' | tr -d '\r')"
  DEFAULT="${DEFAULT:-main}"
  
  AHEAD=$(git rev-list --count origin/"$DEFAULT"..HEAD 2>/dev/null || echo 0)
  if [ "$AHEAD" -gt 0 ]; then
    echo "[!] Ahead of origin/$DEFAULT by $AHEAD commits"
  fi
done
echo ""
echo "== AUDIT COMPLETE =="
