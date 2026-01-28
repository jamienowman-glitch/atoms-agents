"use client";

import React from 'react';

interface Option {
  id: string;
  name: string;
  provider_id?: string;
}

interface ControlPanelProps {
  providers: Option[];
  models: Option[];
  personas: Option[];
  manifests: Option[];
  reasoningProfiles: Option[];
  firearmsLicenses: Option[];
  selected: {
    providerId: string;
    modelId: string;
    personaId: string;
    manifestId: string;
    reasoningId: string;
    licenseId: string;
  };
  onChange: (key: string, value: string) => void;
}

export function ControlPanel({
  providers, models, personas, manifests, reasoningProfiles, firearmsLicenses,
  selected, onChange
}: ControlPanelProps) {

  // Filter models based on selected provider
  const filteredModels = models.filter(m => m.provider_id === selected.providerId || !m.provider_id);

  const Select = ({ label, id, options, value }: { label: string, id: string, options: Option[], value: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto w-80 flex-shrink-0">
      <h2 className="text-lg font-bold mb-4">Workbench Controls</h2>

      <Select label="Provider" id="providerId" options={providers} value={selected.providerId} />
      <Select label="Model" id="modelId" options={filteredModels} value={selected.modelId} />
      <hr className="my-4" />
      <Select label="Reasoning Profile" id="reasoningId" options={reasoningProfiles} value={selected.reasoningId} />
      <Select label="Persona" id="personaId" options={personas} value={selected.personaId} />
      <Select label="Manifest" id="manifestId" options={manifests} value={selected.manifestId} />
      <Select label="Firearms License" id="licenseId" options={firearmsLicenses} value={selected.licenseId} />
    </div>
  );
}
