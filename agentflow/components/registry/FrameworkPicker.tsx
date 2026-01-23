import React, { useEffect, useState } from 'react';
import { registryService, FrameworkCard } from '../../services/RegistryService';
import { AtomPicker } from './AtomPicker';

interface FrameworkPickerProps {
    selectedFrameworkId?: string;
    onSelect: (framework: FrameworkCard) => void;
}

export const FrameworkPicker: React.FC<FrameworkPickerProps> = ({ selectedFrameworkId, onSelect }) => {
    const [frameworks, setFrameworks] = useState<FrameworkCard[]>([]);

    useEffect(() => {
        registryService.listFrameworks().then(setFrameworks);
    }, []);

    return (
        <AtomPicker<FrameworkCard>
            label="Framework"
            items={frameworks}
            selectedId={selectedFrameworkId}
            onSelect={onSelect}
            getKey={(f) => f.framework_id}
            renderItem={(f) => <span>{f.name}</span>}
        />
    );
};
