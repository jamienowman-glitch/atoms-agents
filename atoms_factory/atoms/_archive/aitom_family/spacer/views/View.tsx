import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  const style = {
    height: tokens.size.height,
    width: tokens.size.width,
    background: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #ffffff 10px, #ffffff 20px)' // visual aid
  };
  return <div style={style} title="Spacer" />;
};
