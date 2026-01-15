export const SCHEMA = {
    meta: {
        atom_kind: 'blackboard_node',
        version: '1.0.0'
    },
    content: {
        name: {
            content: 'Shared Blackboard',
            placeholder: 'Name'
        },
        is_persistent: {
            content: false,
            controller_kind: 'boolean'
        }
    },
    style: {
        background_color: '#333333',
        text_color: '#ffffff'
    }
};
