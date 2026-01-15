import React from 'react';
import { GenericNodeView } from '../components/views/GenericNodeView';
import { AgentNodeView } from '../components/views/AgentNodeView';
import { FrameworkNodeView } from '../components/views/FrameworkNodeView';
import { BlackboardNodeView } from '../components/views/BlackboardNodeView';

// Mapping of NodeType string to React Component
export const NodeViewRegistry: Record<string, React.FC<any>> = {
    'agent_node': AgentNodeView,
    'framework_node': FrameworkNodeView,
    'blackboard_node': BlackboardNodeView,
    'header': GenericNodeView,
    'task_node': GenericNodeView,
    'artefact_node': GenericNodeView,
    'asset_node': GenericNodeView,
    'router_node': GenericNodeView,

    // Legacy/Fallback aliases
    'connector': GenericNodeView,
    'agent': GenericNodeView,
    'framework': GenericNodeView,
    'blackboard': GenericNodeView
};
