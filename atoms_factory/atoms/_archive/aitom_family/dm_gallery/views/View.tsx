import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      display: tokens.layout.display,
      gap: tokens.spacing.gap,
      padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch'
    }}>
        {tokens.content.cards.map((card: any, i: number) => (
            <div key={i} style={{
                flex: '0 0 auto',
                width: 160,
                background: '#fff',
                borderRadius: 8,
                border: '1px solid #eee',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }}>
                <div style={{width: 140, height: 100, background: `url(${card.image}) center/cover`, borderRadius: 4}} />
                <div style={{fontSize: tokens.typography.title.size, fontWeight: tokens.typography.title.weight, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {card.title}
                </div>
            </div>
        ))}
    </div>
  );
};
