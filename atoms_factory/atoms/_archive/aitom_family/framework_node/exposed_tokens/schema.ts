import { AssetRegistry } from '../../../../apps/workbench/src/logic/AssetRegistry';

export const SCHEMA = {
    meta: {
        atom_kind: 'framework_node',
        version: '1.0.0'
    },
    content: {
        framework_name: {
            content: 'Framework Name',
            placeholder: 'Name'
        },
        icon: {
            src: AssetRegistry.icons.northstar_agent
        },
        nested_agents_count: {
            content: 0,
            controller_kind: 'number'
        }
    },
    style: {
        background_color: '#f8f9fa',
        border_color: '#dee2e6',
        text_color: '#212529'
    }
};
