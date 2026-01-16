import React, { useState } from 'react';
import { useRegistry, RegistryItem } from '@/lib/registry/useRegistry';
import { RegistryCard } from './ui/RegistryCard';
import { AddButton } from './ui/AddButton';

interface GenericRegistryViewProps {
    namespace: string;
    onConfigure: (item: RegistryItem) => void;
    onAddNew: () => void;
}

export const GenericRegistryView: React.FC<GenericRegistryViewProps> = ({ namespace, onConfigure, onAddNew }) => {
    const { data: items, isLoading } = useRegistry(namespace);

    if (isLoading) {
        return <div className="p-12 text-center text-zinc-500 font-mono text-xs">Loading registry data...</div>;
    }

    const registryItems = items || [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {registryItems.map((item) => (
                <RegistryCard
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    status={item.status}
                    onEdit={() => onConfigure(item)}
                    onDelete={() => console.log('Delete feature coming soon', item.id)}
                />
            ))}

            <AddButton onClick={onAddNew} />
        </div>
    );
};
