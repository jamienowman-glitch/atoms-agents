import { AtomContract } from '@ui-types/AtomContract';
import { HeaderAtomContract } from '@atoms/HeaderAtom.contract';
import { BleedingHeroContract } from '@atoms/BleedingHero.contract';

// Registry of all Available Atoms
// This powers the "Dynamic ToolPill"
export const AVAILABLE_ATOMS: AtomContract[] = [
    // Copy
    HeaderAtomContract,

    // Media
    BleedingHeroContract,

    // Future additions will go here...
];
