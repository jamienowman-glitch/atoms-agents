import { AssetRegistry } from '../../../../apps/workbench/src/logic/AssetRegistry';

export const SCHEMA = {
    meta: {
        atom_kind: 'agent_node',
        version: '1.0.0'
    },
    content: {
        agent_name: {
            content: 'Agent Name',
            placeholder: 'e.g. Customer Support'
        },
        agent_kind: {
            content: 'Kind',
            placeholder: 'e.g. Chat'
        },
        icon: {
            src: AssetRegistry.icons.northstar_agent
        }
    },
    style: {
        background_color: '#000000',
        text_color: '#ffffff',
        accent_color: '#333333'
    }
};
