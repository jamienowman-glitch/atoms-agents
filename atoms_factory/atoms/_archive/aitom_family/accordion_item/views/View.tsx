import React, { useState } from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  const [isOpen, setIsOpen] = useState(tokens.interaction.open_by_default);

  return (
    <div style={{
      width: tokens.size.width,
      border: `${tokens.border.width} solid ${tokens.color.border}`,
      borderRadius: tokens.border.radius,
      overflow: 'hidden',
      backgroundColor: isOpen ? tokens.color.expanded_bg : tokens.color.background
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: tokens.typography.title.weight,
          color: tokens.typography.title.color,
          fontSize: tokens.typography.title.size
        }}
      >
        <span>{tokens.content.title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </div>

      {isOpen && (
        <div style={{
          padding: `0 ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
          color: tokens.typography.body.color,
          fontSize: tokens.typography.body.size,
          lineHeight: tokens.typography.body.line_height
        }}>
          {tokens.content.body}
        </div>
      )}
    </div>
  );
};
