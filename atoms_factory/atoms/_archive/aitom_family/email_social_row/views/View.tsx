import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: tokens.layout.justify,
      gap: tokens.spacing.gap,
      padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`
    }}>
        {tokens.content.networks.map((net: any) => (
            <a key={net.id} href={net.url} target="_blank">
                <img src={net.icon} width={tokens.size.icon_size} height={tokens.size.icon_size} alt={net.id} style={{display:'block'}} />
            </a>
        ))}
    </div>
  );
};
