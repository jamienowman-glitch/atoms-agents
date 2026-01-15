import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`
    }}>
      <h2 style={{
          textAlign: tokens.typography.heading.align as any,
          fontSize: tokens.typography.heading.size,
          fontWeight: tokens.typography.heading.weight,
          marginBottom: 32
      }}>{tokens.content.title}</h2>
      
      <div style={{
          display: tokens.layout.display,
          gridTemplateColumns: tokens.layout.grid_template_columns,
          gap: tokens.layout.gap
      }}>
          {/* Mock Products */}
          <div style={{background: '#eee', height: 400}}>Product 1</div>
          <div style={{background: '#eee', height: 400}}>Product 2</div>
          <div style={{background: '#eee', height: 400}}>Product 3</div>
          <div style={{background: '#eee', height: 400}}>Product 4</div>
      </div>
    </div>
  );
};
