import React from 'react';
import { AgentNodeView } from '../../components/multi21/graph-views/AgentNodeView';
import { FrameworkNodeView } from '../../components/multi21/graph-views/FrameworkNodeView';
import { BlackboardNodeView } from '../../components/multi21/graph-views/BlackboardNodeView';
import { GenericNodeView } from '../../components/multi21/graph-views/GenericNodeView';

export const NodeViewRegistry: Record<string, React.FC<any>> = {
    agent_node: AgentNodeView,
    framework_node: FrameworkNodeView,
    blackboard_node: BlackboardNodeView,
    task_node: (props: any) => <GenericNodeView {...props} label="Task" />,
    artefact_node: (props: any) => <GenericNodeView {...props} label="Artefact" />,
    asset_node: (props: any) => <GenericNodeView {...props} label="Asset" />,
    router_node: (props: any) => <GenericNodeView {...props} label="Router" />,
    header: (props: any) => <div className="text-xl font-bold border-b border-black w-full pb-2"> {props.title} </div>
};
