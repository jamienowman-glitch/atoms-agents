import React from 'react';
// import { cn } from '@/lib/utils'; 

export interface GenericAtomProps {
  // --- STABLE PROPS (DO NOT REMOVE) ---
  // Layout
  gridColsDesktop?: number;
  gapX?: number;
  gapY?: number;
  radius?: number;
  
  // Typography (Stable)
  fontFamily?: number; // 0-3 index
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Style (Stable)
  styleBg?: string;
  styleText?: string;
  styleBorder?: string;
  styleOpacity?: number;

  // --- ATOM SPECIFIC PROPS (Extended via Tech Spec) ---
}

export const GenericAtom = ({
  gridColsDesktop = 4,
  gapX = 16,
  gapY = 16,
  radius = 0,
  fontFamily = 0,
  fontSize = 16,
  styleBg = 'transparent',
  styleOpacity = 100,
  ...props
}: GenericAtomProps) => {

  // STABLE LOGIC: Font Resolver (Mock for Template)
  const getFontFamilyVar = (idx: number) => `var(--font-family-${idx})`;

  // STABLE LOGIC: Variable Injection
  const stableStyle = {
    '--grid-cols': gridColsDesktop,
    '--gap-x': `${gapX}px`,
    '--gap-y': `${gapY}px`,
    '--radius': `${radius}px`,
    '--multi-font-family': getFontFamilyVar(fontFamily),
    '--multi-font-size': `${fontSize}px`,
    '--multi-text-align': props.textAlign || 'left',
    '--style-bg': styleBg,
    '--style-opacity': styleOpacity / 100,
  } as React.CSSProperties;

  return (
    <div className="w-full h-full relative group" style={stableStyle}>
      {/* CONTENT SLOT: The Worker Agent fills this */}
      <div className="multi21-atom-content p-[var(--gap-x)]">
        <div className="border border-dashed border-white/20 p-4 text-center text-xs opacity-50">
          GENERIC ATOM CONTENT
        </div>
      </div>
    </div>
  );
};
