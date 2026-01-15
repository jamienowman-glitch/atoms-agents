import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  const style = {
    display: tokens.layout.display,
    gridTemplateColumns: tokens.layout.grid_template_columns,
    gap: tokens.spacing.gap,
    alignItems: tokens.layout.align_items,
    width: tokens.size.width
  };

  return (
    <div style={style}>
      {/* Mock columns */}
      <div style={{ background: '#f0f0f0', padding: 20 }}>Column 1</div>
      <div style={{ background: '#f0f0f0', padding: 20 }}>Column 2</div>
    </div>
  );
};
