import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <blockquote style={{
      margin: `${tokens.spacing.margin.top} 0 ${tokens.spacing.margin.bottom} 0`,
      padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
      borderLeft: `${tokens.border.width} solid ${tokens.color.border_left}`,
      backgroundColor: tokens.color.background,
      color: tokens.color.text
    }}>
      <p style={{
        margin: '0 0 10px',
        fontSize: tokens.typography.quote.size,
        fontWeight: tokens.typography.quote.weight,
        fontStyle: tokens.typography.quote.style as any
      }}>
        “{tokens.content.quote}”
      </p>
      <cite style={{
        display: 'block',
        fontSize: tokens.typography.author.size,
        fontWeight: tokens.typography.author.weight,
        color: tokens.typography.author.color,
        fontStyle: 'normal'
      }}>
        — {tokens.content.author}
      </cite>
    </blockquote>
  );
};
