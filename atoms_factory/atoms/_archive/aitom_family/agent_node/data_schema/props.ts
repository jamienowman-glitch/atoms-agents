export interface Props {
    name: string;
    kind: string;
    status?: string;
    ports_count?: number;
    onClick?: () => void;
}
