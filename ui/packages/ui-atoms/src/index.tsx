import { AtomProps } from '@northstar/builder-registry';
// Legacy/Core Layouts
import { HeroSection, TextSection } from '@northstar/builder-layout';
import { HeadlineBlock } from '@northstar/builder-copy';

// New Local Atoms (P0)
import { MediaBlock } from './components/MediaBlock';
import { GuidesBlock } from './components/GuidesBlock';
import { VectorBlock } from './components/VectorBlock';
import { ButtonBlock } from './components/ButtonBlock';
import { TextBlock } from './components/TextBlock';

// Multi21 Core (Removed)

export const ImageBlock: React.FC<AtomProps> = ({ properties, isSelected, onClick }) => {
    return (
        <div
            onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
            style={{
                margin: '16px 0',
                border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                display: 'inline-block'
            }}
        >
            {properties.src ? (
                <img
                    src={properties.src}
                    alt={properties.alt}
                    style={{
                        width: `${properties.width}%`,
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: '200px',
                    background: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                }}>
                    No Image Selected
                </div>
            )}
        </div>
    );
};

// Legacy Compat
export const BoxAtom: React.FC<AtomProps> = ({ id, properties, children, isSelected, onClick }) => (
    <div onClick={onClick} style={{ padding: properties.padding, background: properties.background, border: isSelected ? '2px solid blue' : '1px solid #eee' }}>{children}</div>
);

// --- Registry ---

export const AtomRegistry: Record<string, React.FC<AtomProps>> = {
    // Layout
    'hero-section': HeroSection,
    'text-section': TextSection,

    // Core P0 Atoms
    // Core P0 Atoms
    'media-block': MediaBlock,
    'guides-block': GuidesBlock,
    'vector-block': VectorBlock,
    'button-block': ButtonBlock,
    'text-block': TextBlock,

    // Compat / Aliases
    'headline-block': HeadlineBlock,
    'image-block': ImageBlock,
    'box': BoxAtom,
    'text': TextBlock
};

export {
    HeroSection, TextSection, HeadlineBlock,
    MediaBlock, GuidesBlock, VectorBlock, ButtonBlock, TextBlock,
    // Multi21 Core - Removed
};


