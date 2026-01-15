import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  const style = {
    padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
      width: tokens.size.width
  };
  const lineStyle = {
      height: tokens.size.height,
      backgroundColor: tokens.color.border,
      width: '100%'
  };

  return (
    <div style={style}>
        <div style={lineStyle} />
    </div>
  );
};
