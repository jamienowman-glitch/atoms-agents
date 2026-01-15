import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  const style: React.CSSProperties = {
    position: 'relative',
    height: tokens.size.height,
    width: tokens.size.width,
    display: tokens.layout.display,
    flexDirection: tokens.layout.flex_direction as any,
    alignItems: tokens.layout.align_items,
    justifyContent: tokens.layout.justify_content,
    padding: `${tokens.spacing.padding.top} ${tokens.spacing.padding.right} ${tokens.spacing.padding.bottom} ${tokens.spacing.padding.left}`,
      color: tokens.color.text,
      textAlign: 'center'
  };

  return (
    <div style={style}>
        {/* Background Image + Overlay */}
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${tokens.content.image.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
        }} />
        <div style={{
             position: 'absolute',
             top: 0, left: 0, right: 0, bottom: 0,
             backgroundColor: 'black',
             opacity: tokens.color.overlay_opacity,
             zIndex: 1
        }} />
        
        {/* Content */}
        <div style={{zIndex: 2, position: 'relative', display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap}}>
             <h1 style={{
                 fontSize: tokens.typography.title.size, 
                 fontWeight: tokens.typography.title.weight,
                 margin: 0
            }}>
                {tokens.content.text.title}
             </h1>
             <p style={{
                 fontSize: tokens.typography.subtitle.size,
                 fontWeight: tokens.typography.subtitle.weight,
                 margin: 0
             }}>
                 {tokens.content.text.subtitle}
             </p>
             <button style={{
                 padding: '12px 24px',
                 background: 'white',
                 color: 'black',
                 border: 'none',
                 fontSize: '16px',
                 cursor: 'pointer'
             }}>
                 {tokens.content.text.button_label}
             </button>
        </div>
    </div>
  );
};
