import React from 'react';
import { Props } from '../data_schema/props';
import { SCHEMA } from '../exposed_tokens/schema';

export const LensHeaderNodeView: React.FC<Props> = ({ title, subtitle }) => {
    return (
        <div style={{ width: '100%', padding: '20px 0', borderBottom: `1px solid ${SCHEMA.style.line_color}` }}>
            <h2 style={{
                fontSize: '24px',
                fontWeight: 800,
                color: SCHEMA.style.text_color,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '1px'
            }}>
                {title || SCHEMA.content.title_text.content}
            </h2>
            {(subtitle || SCHEMA.content.subtitle_text.content) && (
                <div style={{ fontSize: '14px', color: '#aaa', marginTop: '4px' }}>
                    {subtitle || SCHEMA.content.subtitle_text.content}
                </div>
            )}
        </div>
    );
};
