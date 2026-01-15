import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  const isUser = tokens.content.sender === 'user';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: tokens.spacing.margin.bottom,
      marginTop: tokens.spacing.margin.top
    }}>
      <div style={{
        maxWidth: tokens.size.max_width,
        padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
      borderRadius: tokens.border.radius,
      backgroundColor: isUser ? tokens.color.user_background : tokens.color.background,
      color: isUser ? tokens.color.user_text : tokens.typography.base.color,
      fontSize: tokens.typography.base.size,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      lineHeight: tokens.typography.base.line_height
        }}>
      {tokens.content.text}
    </div>
    </div >
  );
};
