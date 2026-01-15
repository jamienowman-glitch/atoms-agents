import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{ textAlign: tokens.layout.align as any, marginBottom: tokens.spacing.margin.bottom }}>
      <a href={tokens.linking.href} style={{
        display: 'inline-block',
        backgroundColor: tokens.color.background,
        color: tokens.typography.color,
        fontFamily: tokens.typography.family,
        fontSize: tokens.typography.size,
        fontWeight: tokens.typography.weight as any,
        padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
      textDecoration: 'none',
      borderRadius: tokens.border.radius
        }}>
      {tokens.content.label}
    </a>
    </div >
  );
};
