import React from 'react';
import { Props } from '../data_schema/props';
import { SCHEMA } from '../exposed_tokens/schema';
import { AssetRegistry } from '../../../../apps/workbench/src/logic/AssetRegistry';

export const BlackboardNodeView: React.FC<Props> = (props) => {
    return (
        <div style={{
            width: '220px',
            height: '100px',
            border: '2px solid' + SCHEMA.style.text_color,
            borderRadius: '8px',
            backgroundColor: SCHEMA.style.background_color,
            color: SCHEMA.style.text_color,
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
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{props.name || SCHEMA.content.name.content}</div>

            {props.is_persistent && (
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
