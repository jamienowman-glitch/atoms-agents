import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      fontFamily: 'Roboto Flex',
      fontSize: tokens.typography.base.size,
      lineHeight: tokens.typography.base.line_height,
      color: tokens.typography.base.color,
      marginBottom: tokens.spacing.margin.bottom
    }} dangerouslySetInnerHTML={{ __html: tokens.content.html }} />
  );
};
