export interface Props {
    name: string;
    nested_agents_count?: number;
    onNestedAgentsClick?: () => void;
    onClick?: () => void;
}
