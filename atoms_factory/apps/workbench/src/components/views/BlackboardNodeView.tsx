import React from 'react';
import { AssetRegistry } from '../../logic/AssetRegistry';

export const BlackboardNodeView: React.FC<any> = (props) => {
    const isPersistent = props.is_persistent || props.node?.blackboard?.is_persistent;
    const name = props.name || props.node?.blackboard?.name || "Shared Memory";

    return (
        <div style={{
            width: '220px',
            height: '100px',
            border: '2px solid #ffffff',
            borderRadius: '8px',
            backgroundColor: '#000000',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '10px',
            position: 'relative'
        }}
            onClick={props.onClick}
        >
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{name}</div>

            {isPersistent && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '16px',
                    height: '16px'
                }}>
                    <img
                        src={AssetRegistry.icons.database_icon}
                        alt="Persistent"
                        style={{ width: '100%', height: '100%', filter: 'invert(1)' }}
                    />
                </div>
            )}
        </div>
    );
};
