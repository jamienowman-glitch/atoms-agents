
# NORTHSTAR – GCP AUTH / KEY PLAYBOOK (DEV + PROD)

**Goal:**
One service-account key per environment.
No browser login loops. No personal Google account required for engines.

---

## 0. Fill these in for each ENV

For dev you already have:
*   `PROJECT_ID=northstar-os-dev`
*   `REGION=us-central1`
*   `ZONE=us-central1-a`
*   `SA_EMAIL=gcloud-admin-sa@northstar-os-dev.iam.gserviceaccount.com`
*   `SA_KEY_PATH=$HOME/northstar-keys/northstar-os-dev-877e05648e82.json`

For prod later, you’ll repeat the same pattern with a different BOARD, SA_EMAIL, and key path.

---

## 1. (Optional) Nuclear cleanup when things are messy

Run this once when a machine / repo is full of old auth junk:

```bash
gcloud auth list
gcloud auth revoke url-signer@squared2-forge.iam.gserviceaccount.com || true
gcloud auth revoke jay@redpensquared.com || true
gcloud auth revoke northstar-dev-engines@northstar-os-dev.iam.gserviceaccount.com || true

gcloud auth application-default revoke || true
rm -f "$HOME/.config/gcloud/application_default_credentials.json" || true
```

Result you want:

```bash
gcloud auth list
# ACTIVE  ACCOUNT
# *       gcloud-admin-sa@northstar-os-dev.iam.gserviceaccount.com  (or will be set below)
#         jamienowman@gmail.com
```

---

## 2. One-time: put the key somewhere stable

You already did this for dev:

```bash
mkdir -p "$HOME/northstar-keys"
# Move the downloaded JSON here, or copy it:
#   northstar-os-dev-877e05648e82.json
```

For prod later:
`$HOME/northstar-keys/northstar-os-prod-XXXX.json`

---

## 3. One-time: clean .zshrc setup

Open `.zshrc` and make sure it looks like this structure:

```bash
source "$HOME/google-cloud-sdk/path.zsh.inc"
source "$HOME/google-cloud-sdk/completion.zsh.inc"

alias forgeup='cd ~/forge_agent && source .venv/bin/activate && python -m forge2_builder.main'

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

export PATH="$HOME/Library/Python/3.12/bin:$PATH"
export PATH="$(npm prefix -g)/bin:$PATH"

# Added by Antigravity
export PATH="$HOME/.antigravity/antigravity/bin:$PATH"

# Northstar DEV – service account key
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/northstar-keys/northstar-os-dev-877e05648e82.json"
```

Then reload it:
`source "$HOME/.zshrc"`

---

## 4. Per-machine, once: set the gcloud config for DEV

```bash
gcloud config set account gcloud-admin-sa@northstar-os-dev.iam.gserviceaccount.com
gcloud config set project northstar-os-dev
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a
gcloud config set ai/region us-central1
```

Check: `gcloud config list`

---

## 5. Per-shell / per-venv: activate the service account (DEV)

Whenever you open a new shell to work on a repo:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/northstar-keys/northstar-os-dev-877e05648e82.json"
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
```

Verify: `gcloud auth list`

---

## 6. Production variant (when you’re ready)

1.  Create prod project and service account.
2.  Save key to `$HOME/northstar-keys/northstar-os-prod-XXXX.json`.
3.  Add PROD block to `.zshrc` to toggle.
4.  Run config commands with PROD values.

---

## B. Codex environment setup – per repo

### 1. Create / edit Codex environment
*   **Repository**: `engines` (or match repo name)
*   **Name**: `jamienowman-glitch/<repo-name>`
*   **Description**: Short label.
*   **Container image**: `universal`.

### 2. Setup & maintenance scripts

**Setup script:**
```bash
#!/usr/bin/env bash
set -e
cd /workspace/engine
python -m venv .venv
source .venv/bin/activate
if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi
```

**Maintenance script:**
```bash
#!/usr/bin/env bash
set -e
cd /workspace/engine || exit 1
if [ -d .venv ]; then
  source .venv/bin/activate
fi
if [ -f requirements.txt ]; then
  pip install -r requirements.txt || true
fi
```

### 3. Environment variables (engines example)
```bash
ENV = dev
TENANT_ID = t-northstar-dev

GCP_PROJECT_ID = northstar-os-dev
GCP_REGION     = us-central1

RAW_BUCKET      = gs://northstar-os-dev-northstar-raw
DATASETS_BUCKET = gs://northstar-os-dev-northstar-datasets

VECTOR_PROJECT_ID = northstar-os-dev
VECTOR_ENDPOINT_ID = projects/292895265768/locations/us-central1/indexEndpoints/8758219244677627904
VECTOR_INDEX_ID    = projects/292895265768/locations/us-central1/indexes/236661081785761792

TEXT_EMBED_MODEL  = text-embedding-004
IMAGE_EMBED_MODEL = multimodalembedding@001
```
