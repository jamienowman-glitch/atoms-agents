import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

// Helper to infer type from SCHEMA (rudimentary)
type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      display: 'flex',
      padding: '16px',
      background: '#fff',
      borderBottom: '1px solid #eee',
      justifyContent: 'space-between'
    }}>
      <div><strong>{tokens.meta?.atom_kind}</strong></div>
      <div>Links Placeholder</div>
    </div>
  );
};
