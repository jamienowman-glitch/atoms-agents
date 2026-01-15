import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      backgroundColor: tokens.color.background,
      border: `${tokens.border.width} ${tokens.border.style} ${tokens.color.border}`,
        borderRadius: tokens.border.radius,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: 0
    }}>
      <div style={{
          aspectRatio: '3/4',
          background: `url(${tokens.content.product.image_src}) center/cover`,
          width: '100%'
      }} />
      <div style={{
          padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap
      }}>
          <div style={{fontSize: tokens.typography.title.size, fontWeight: tokens.typography.title.weight}}>
              {tokens.content.product.title}
          </div>
           <div style={{fontSize: tokens.typography.price.size, fontWeight: tokens.typography.price.weight, color: tokens.typography.price.color}}>
              {tokens.content.product.price}
          </div>
          <button style={{
              width: '100%',
              padding: '10px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
          }}>{tokens.content.button_label}</button>
      </div>
    </div>
  );
};
