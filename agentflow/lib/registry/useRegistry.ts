import useSWR from 'swr';

export interface RegistryItem {
    id: string;
    title: string;
    subtitle: string;
    status: 'Active' | 'Paused' | 'Draft' | 'Inactive';
    scopes?: string[]; // List of available scopes for this connector
}

export interface ConnectorConfig {
    scope_requirements?: Record<string, string>;
    utm_defaults?: {
        source: string;
        medium: string;
    };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRegistry(namespace: string) {
    const { data, error, isLoading, mutate } = useSWR(`/api/v1/registry/${namespace}`, fetcher);

    return {
        data: data as RegistryItem[] | undefined,
        isLoading,
        isError: error,
        mutate,
    };
}
