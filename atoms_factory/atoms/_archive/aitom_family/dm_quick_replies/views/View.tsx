import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      display: tokens.layout.display,
      flexWrap: tokens.layout.wrap as any,
      gap: tokens.spacing.gap,
      padding: 10
    }}>
      {tokens.content.options.map((opt: string, i: number) => (
        <button key={i} style={{
          background: tokens.color.background,
          color: tokens.typography.base.color,
          border: `${tokens.border.width} ${tokens.border.style} ${tokens.color.border}`,
      borderRadius: tokens.border.radius,
      padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
      fontSize: tokens.typography.base.size,
      fontWeight: tokens.typography.base.weight,
      cursor: 'pointer'
             }}>
      {opt}
    </button>
  ))
}
    </div >
  );
};
