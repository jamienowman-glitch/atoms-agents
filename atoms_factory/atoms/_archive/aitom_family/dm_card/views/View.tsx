import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      width: tokens.size.width,
      backgroundColor: tokens.color.background,
      border: `${tokens.border.width} ${tokens.border.style} ${tokens.color.border}`,
        borderRadius: tokens.border.radius,
        overflow: 'hidden',
        boxShadow: tokens.effects.shadow,
        margin: `${tokens.spacing.margin.top} auto ${tokens.spacing.margin.bottom}`
    }}>
        <div style={{
            height: 140,
            background: `url(${tokens.content.image}) center/cover`,
        }} />
        <div style={{padding: 16}}>
            <div style={{fontSize: tokens.typography.title.size, fontWeight: tokens.typography.title.weight, marginBottom: 4}}>
                {tokens.content.title}
            </div>
             <div style={{fontSize: tokens.typography.subtitle.size, fontWeight: tokens.typography.subtitle.weight, color: tokens.typography.subtitle.color}}>
                {tokens.content.subtitle}
            </div>
        </div>
        <div style={{borderTop: `1px solid ${tokens.color.border}`, display: 'flex', flexDirection: 'column'}}>
            {tokens.content.buttons.map((btn: any, i: number) => (
                <button key={i} style={{
                    background: 'none',
                    border: 'none',
                    borderTop: i > 0 ? `1px solid ${tokens.color.border}` : 'none',
                    padding: '12px',
                    color: '#0084ff',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer'
                }}>
                    {btn.label}
                </button>
            ))}
        </div>
    </div>
  );
};
