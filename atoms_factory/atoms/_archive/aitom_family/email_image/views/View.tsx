import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{ textAlign: tokens.layout.align as any, paddingBottom: tokens.spacing.padding.bottom }}>
      <img
        src={tokens.content.src}
        alt={tokens.content.alt}
        style={{
          width: '100%',
          maxWidth: tokens.size.max_width,
          height: 'auto',
          display: 'block'
        }}
      />
    </div>
  );
};
