import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  const style: React.CSSProperties = {
    display: tokens.layout.display,
    flexDirection: tokens.layout.flex_direction as any,
    alignItems: tokens.layout.align_items,
    gap: tokens.spacing.gap,
    background: tokens.color.background,
    width: tokens.size.width
  };

  const textContainer = {
    flex: 1,
    padding: '40px'
  };

  const imageContainer = {
    flex: 1,
    height: '400px',
    background: `url(${tokens.content.image.src}) center/cover no-repeat`,
      backgroundColor: tokens.color.image_bg
  };

  return (
    <div style={style}>
        <div style={imageContainer} title={tokens.content.image.alt} />
        <div style={textContainer}>
            <h2 style={{margin: '0 0 16px', fontSize: tokens.typography.title.size, fontWeight: tokens.typography.title.weight}}>
                {tokens.content.text.title}
            </h2>
            <p style={{margin: 0, fontSize: tokens.typography.body.size, lineHeight: tokens.typography.body.line_height}}>
                {tokens.content.text.body}
            </p>
        </div>
    </div>
  );
};
