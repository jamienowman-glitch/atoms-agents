import React from 'react';

export const GenericNodeView: React.FC<any> = (props) => {
    // Determine label and dimensions
    let label = "Node";
    let sub = "";
    let width = 120;
    let height = 60;

    // Agent
    if (props.node?.agent?.name_override || props.node?.agent?.card_ref) {
        if (props.node?.agent?.name_override) label = props.node.agent.name_override;
        else if (props.node?.agent?.card_ref) sub = props.node.agent.card_ref;
        // Default 120x60
    }

    // Framework
    else if (props.node?.framework?.kind) {
        label = props.name || "Framework";
        sub = props.node.framework.kind;
        width = 200;
        height = 180;
    }

    // Blackboard
    else if (props.board?.name) {
        label = props.board.name;
        width = 220;
        height = 100;
    }

    // Task
    else if (props.task?.ref) {
        label = props.task.ref;
    }

    // Artefact
    else if (props.artefact?.name) {
        label = props.artefact.name;
    }

    // Asset
    else if (props.asset?.name) {
        label = props.asset.name;
    }

    // Router
    else if (props.route?.condition) {
        label = "Router";
        sub = props.route.condition.expr;
    }

    // Header
    else if (props.title) {
        label = props.title;
        width = 300;
        height = 50;
    }

    return (
        <div style={{
            background: '#fff',
            border: '1px solid #000',
            borderRadius: '8px',
            padding: '8px 12px',
            width: `${width}px`,
            height: `${height}px`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontFamily: 'sans-serif',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
            {sub && <div style={{ fontSize: '10px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
            {props.children}
        </div>
    );
};
