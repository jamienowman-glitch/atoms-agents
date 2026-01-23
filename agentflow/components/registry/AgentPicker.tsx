import React, { useEffect, useState } from 'react';
import { registryService, ModelFamily, ModelCard } from '../../services/RegistryService';
import { AtomPicker } from './AtomPicker';

interface AgentPickerProps {
    selectedModelId?: string;
    onSelect: (model: ModelCard) => void;
}

export const AgentPicker: React.FC<AgentPickerProps> = ({ selectedModelId, onSelect }) => {
    const [families, setFamilies] = useState<ModelFamily[]>([]);
    const [models, setModels] = useState<ModelCard[]>([]);
    const [selectedFamilyId, setSelectedFamilyId] = useState<string>("");

    useEffect(() => {
        registryService.listFamilies().then(setFamilies);
    }, []);

    useEffect(() => {
        if (selectedFamilyId) {
            registryService.listModels(selectedFamilyId).then(setModels);
        } else {
            setModels([]);
        }
    }, [selectedFamilyId]);

    return (
        <div className="flex flex-col gap-2">
            <AtomPicker<ModelFamily>
                label="Model Family"
                items={families}
                selectedId={selectedFamilyId}
                onSelect={(f) => setSelectedFamilyId(f.family_id)}
                getKey={(f) => f.family_id}
                renderItem={(f) => <span>{f.name}</span>}
            />

            <AtomPicker<ModelCard>
                label="Version / Variant"
                items={models}
                selectedId={selectedModelId}
                onSelect={onSelect}
                getKey={(m) => m.model_id}
                renderItem={(m) => <span>{m.version} - {m.variant}</span>}
                placeholder={selectedFamilyId ? "Select Version..." : "Select Family First"}
            />
        </div>
    );
};
