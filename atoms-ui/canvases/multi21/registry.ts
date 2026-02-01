import { AtomContract } from '../../types/AtomContract';
import { HeaderAtomContract } from './_atoms/HeaderAtom.contract';
import { BleedingHeroContract } from './_atoms/BleedingHero.contract';

// Registry of all Available Atoms
// This powers the "Dynamic ToolPill"
export const AVAILABLE_ATOMS: AtomContract[] = [
    // Copy
    HeaderAtomContract,

    // Media
    BleedingHeroContract,

    // Future additions will go here...
];
