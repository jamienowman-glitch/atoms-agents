# Atom Factory

This repository contains the "Aitom Family" common UI atoms and the Workbench app used to inspect and edit them.

## Directory Structure
- `atoms/aitom_family/`: Contains the 49 individual atom components.
- `atoms/aitom_family/_shared/`: Shared utilities (e.g. typography).
- `fonts/`: Shared fonts (Roboto Flex).
- `apps/workbench/`: The React/Vite app for previewing atoms.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1.  Install dependencies from the root:
    ```bash
    npm install
    ```
    This installs shared dependencies (React) and workspace dependencies.

2.  Navigate to the workbench:
    ```bash
    cd apps/workbench
    ```

### Running the Workbench
From `apps/workbench`:
```bash
npm run dev
```
Open the URL (usually http://localhost:5173) to view the workbench.

### Workbench Features
- **Sidebar**: Select an atom to inspect.
- **Preview**: Live preview of the atom with Roboto Flex typography.
- **Token Editor**: Edit exposed tokens (colors, layout, typography) in real-time.

## Migration Note
These atoms were migrated from `aitoms_fam`. The original copies in that repo have been deleted.
Migration report: [MOVE_REPORT.md](./MOVE_REPORT.md)
