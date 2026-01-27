#!/bin/bash

# Guardrail: .env files are forbidden (Vault Law)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/scripts/guard_no_env_files.sh" ]; then
  bash "$SCRIPT_DIR/scripts/guard_no_env_files.sh"
fi

# Configuration
# Directories to iterate through. 
# Make sure these are relative paths from where the script is run (the root).
TARGET_DIRS=("agentflow" "northstar-engines" "ui" "northstar-agents" "atoms_factory")

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Flag parsing
PULL_ENABLED=false
POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    -p|--pull)
      PULL_ENABLED=true
      shift # past argument
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("$1") # save positional arg
      shift # past argument
      ;;
  esac
done

set -- "${POSITIONAL_ARGS[@]}" # restore positional parameters

# Message handling
DEFAULT_MSG="Auto-Sync: Phase Update"
COMMIT_MSG="${1:-$DEFAULT_MSG}"

echo -e "${BLUE}🌌 Starting Galaxy Sync Protocol...${NC}"
if [ "$PULL_ENABLED" = true ]; then
    echo -e "${BLUE}⬇️  Pull Enabled: Will pull changes before pushing.${NC}"
fi
echo -e "${BLUE}📝 Commit Message: \"$COMMIT_MSG\"${NC}"
echo "---------------------------------------------------"

# Function to handle git operations for a directory
sync_repo() {
    local dir=$1
    local name=$2

    if [ -d "$dir/.git" ]; then
        echo -e "${YELLOW}🚀 Syncing $name...${NC}"
        
        # Navigate to directory
        pushd "$dir" > /dev/null
        
        # Pull if enabled
        if [ "$PULL_ENABLED" = true ]; then
            echo -e "   ⬇️  Pulling latest changes..."
            if git pull origin main; then
                 echo -e "   ✅ Pull successful"
            else
                 echo -e "${RED}   ❌ Pull failed. Continuing with local changes...${NC}"
            fi
        fi
        
        # Git operations
        git add .
        
        # Check if there are changes to commit
        if git diff-index --quiet HEAD --; then
            echo -e "   No changes to commit in $name."
        else
            git commit -m "$COMMIT_MSG"
            # Capture push output to check for success/failure
            if git push origin main; then
                echo -e "${GREEN}✅ $name pushed${NC}"
            else
                echo -e "${RED}❌ Failed to push $name${NC}"
            fi
        fi
        
        # Return to root
        popd > /dev/null
    else
        echo -e "${RED}⚠️  Skipping $name: No .git folder found in $dir${NC}"
    fi
}

# 1. Loop through target directories
for target in "${TARGET_DIRS[@]}"; do
    if [ -d "$target" ]; then
        sync_repo "$target" "$target"
    else
        echo -e "${RED}⚠️  Directory not found: $target${NC}"
    fi
done

# 2. Root Sync
echo "---------------------------------------------------"
echo -e "${YELLOW}🚀 Syncing Root Mono-Repo...${NC}"

# Pull if enabled (Root)
if [ "$PULL_ENABLED" = true ]; then
    echo -e "   ⬇️  Pulling latest changes for Root..."
    if git pull origin main; then
         echo -e "   ✅ Pull successful"
    else
         echo -e "${RED}   ❌ Pull failed. Continuing with local changes...${NC}"
    fi
fi

# Root is current directory
git add .
if git diff-index --quiet HEAD --; then
    echo -e "   No changes to commit in Root."
else
    git commit -m "$COMMIT_MSG"
    if git push origin main; then
        echo -e "${GREEN}✅ Root pushed${NC}"
    else
        echo -e "${RED}❌ Failed to push Root${NC}"
    fi
fi

echo "---------------------------------------------------"
echo -e "${BLUE}✨ Galaxy Sync Complete!${NC}"
