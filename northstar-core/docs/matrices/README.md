# Capability Matrices

This directory contains auto-generated matrices of all Framework Modes and Model Capabilities in the repo.
These serve as the "Repo Truth" for inventory.

## Generation

To regenerate these files based on the current filesystem state:

```bash
python3 scripts/generate_capability_matrices.py
```

## Files

- **`framework_modes_matrix.md`**: Inventory of all Modes in `registry/framework_modes`.
- **`model_capabilities_matrix.md`**: Inventory of all Capsules in `src/capabilities`.
- **`capability_master_index.md`**: Summary and Known Gaps.
- **`*.json`**: Machine-readable versions of the above.
