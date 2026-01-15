import React from 'react';
import { Props } from '../data_schema/props';
import { SCHEMA } from '../exposed_tokens/schema';

export const ConnectorNodeView: React.FC<Props> = ({ name, version, platform_badge, onClick }) => {
    // In a real implementation, we would merge props with tokens (SCHEMA)
    // For now, using props as primary data source with styles from schema defaults
    return (
        <div
            onClick={onClick}
            style={{
                border: `1px solid ${SCHEMA.style.border_color}`,
                background: SCHEMA.style.background_color,
                color: SCHEMA.style.text_color,
                padding: '12px',
                borderRadius: '8px',
                minWidth: '150px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}
        >
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{name || SCHEMA.content.connector_name.content}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{version || SCHEMA.content.connector_version.content}</span>
                {(platform_badge || SCHEMA.content.badge_text.content) && (
                    <span style={{
                        fontSize: '10px',
                        background: '#f0f0f0',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                    }}>
                        {platform_badge || SCHEMA.content.badge_text.content}
                    </span>
                )}
            </div>
        </div>
    );
};
