import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      width: tokens.size.width,
      aspectRatio: tokens.size.aspect_ratio,
      borderRadius: tokens.border.radius,
      overflow: 'hidden',
      boxShadow: tokens.effects.shadow,
      marginBottom: tokens.spacing.margin.bottom
    }}>
      <video
        src={tokens.media.src}
        poster={tokens.media.poster}
        controls={tokens.media.controls}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};
