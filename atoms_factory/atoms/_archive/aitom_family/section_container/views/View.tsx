import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  const style = {
    display: tokens.layout.display,
    flexDirection: tokens.layout.flex_direction as any,
    alignItems: tokens.layout.align_items,
    justifyContent: tokens.layout.justify_content,
    padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
      margin: `${tokens.spacing.margin.top} ${tokens.spacing.margin.right} ${tokens.spacing.margin.bottom} ${tokens.spacing.margin.left}`,
      backgroundColor: tokens.color.background,
      maxWidth: tokens.size.max_width,
      width: tokens.size.width,
      // For workbench preview, a border to see it
      border: '1px dashed #ccc'
  };

  return (
    <div style={style}>
      {/* Children slots would go here */}
      <div style={{color:'#999', padding: 20, textAlign: 'center'}}>Slot: Children</div>
    </div>
  );
};
