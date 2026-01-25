# THE LAW: REGISTRY STATE MACHINE

This directory `atoms-registry` is the Source of Truth for the Platform's capabilities.
It is NOT just a list. It is a **State Machine**.

## THE RULES

1.  **READ THE STATUS**
    - `planned`: Use this as a backlog. Agents should check this status to find new tasks.
    - `alpha`: Only use in dev/test environments.
    - `live`: Safe for Production Consoles.
    - `detected`: Detected by forensic scan, needs human verification.

2.  **HIERARCHY IS STRICT**
    - A **Surface** (App) contains **Flows**.
    - A **Flow** uses **Canvases**.
    - A **Canvas** binds **Tools** and **Muscle**.
    - **Muscle** is the lowest level (the actual code execution).

3.  **NO DUPLICATES**
    - If a Muscle exists (e.g., `video_transcode_v1`), refer to it by ID. Do not create a new entry for the same code.

4.  **TENANT OVERRIDES (FUTURE)**
    - This registry defines the *Global* state.
    - Future logic will allow Tenants to override `status` (e.g., enable alpha features for a specific tenant).

5.  **AGENT PROTOCOL**
    - When building a new feature, **register it here first** with `status: planned`.
    - When code is committed, update to `status: alpha`.
    - When verified, update to `status: live`.
