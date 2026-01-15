import { resolveRobotoFlexVariation } from '../../_shared/typography';

import React from 'react';
import { Props } from '../data_schema/props';
import { defaultProps } from '../data_schema/defaults';
import './styles.css';
import { tokens as defaultTokens } from '../exposed_tokens/_index';

export const View: React.FC<Props> = (inputProps) => {
  // Token Wiring
  const t = (inputProps as any).tokens || defaultTokens;
  const resolvedType = resolveRobotoFlexVariation(t.typography);
  const wrapperStyle = {
    '--ns-surface': t.colors?.surface ?? '#fff',
    '--ns-text-primary': t.colors?.text_primary ?? '#000',
    '--ns-border': t.colors?.border ?? '#ccc',
    '--ns-padding': t.layout?.padding ?? '16px',
    '--ns-gap': t.layout?.gap ?? '8px',
    '--ns-radius': t.layout?.radius ?? '4px',
    '--ns-font-variation': resolvedType.fontVariationSettings,
    fontFamily: resolvedType.fontFamily,
    fontSize: resolvedType.fontSize,
    lineHeight: resolvedType.lineHeight,
  } as React.CSSProperties;

    const props = { ...defaultProps, ...inputProps };
    const { label, href, onClick, disabled } = props;

    const Tag = href ? 'a' : 'button';
    const linkProps = href ? { href } : {};

    return (
    <div className="atom-token-wrapper" style={wrapperStyle}>
        <Tag
            className="atom-cta-button"
            {...linkProps}
            onClick={onClick}
            disabled={disabled}
            style={{ fontVariationSettings: "'wght' 600" }} // Variable font
        >
            {label}
        </Tag>
        </div>
  );
};
