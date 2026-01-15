import React from 'react';
import { AssetRegistry } from '../../logic/AssetRegistry';

export const FrameworkNodeView: React.FC<any> = ({ name, nested_agents_count, onNestedAgentsClick, onClick, node }) => {
    // Handling props spread from node.data
    // node.framework.*
    const frameworkName = name || (node?.framework?.name_override) || (node?.framework?.kind) || "Framework";
    const count = nested_agents_count || (node?.framework?.nested_agents_count) || 0;

    return (
        <div
            style={{
                background: '#e0e0e0', // Darker than bg
                border: `2px solid #333`,
                color: '#000',
                padding: '20px',
                // Pentagon shape approximation via clip-path
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
                {frameworkName}
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
                    src={AssetRegistry.icons.northstar_agent}
                    alt="Nested"
                    style={{ width: '12px', height: '12px' }}
                />
                <span>{count} Agents</span>
            </div>
        </div>
    );
};
