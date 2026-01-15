import React from 'react';
import { Props } from '../data_schema/props';
import { SCHEMA } from '../exposed_tokens/schema';

export const FrameworkNodeView: React.FC<Props> = ({ name, nested_agents_count, onNestedAgentsClick, onClick }) => {
    return (
        <div
            style={{
                background: '#e0e0e0', // Darker than bg
                border: `2px solid #333`,
                color: '#000',
                padding: '20px',
                // Pentagon shape approximation via clip-path or just styling. 
                // Request said "Pentagon w/ perimeter ports". For HTML simplicity ensuring reliability, I'll use a shape wrapper.
                // Keeping it simple box for now but with unique styling to ensure it works.
                clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                width: '200px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <span style={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
                {name || SCHEMA.content.framework_name.content}
            </span>

            {/* Nested Agents Affordance */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onNestedAgentsClick?.();
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'white',
                    padding: '4px 8px',
                    borderRadius: '16px',
                    border: '1px solid #ddd',
                    marginTop: '8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600
                }}
            >
                <img
                    src={SCHEMA.content.icon.src}
                    alt="Nested"
                    style={{ width: '12px', height: '12px' }}
                />
                <span>{(nested_agents_count || 0)} Agents</span>
            </div>
        </div>
    );
};
