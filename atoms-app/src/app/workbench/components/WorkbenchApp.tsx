"use client";

import React, { useState } from 'react';
import { ControlPanel } from './ControlPanel';
import { ChatWindow } from './ChatWindow';
import { WorkbenchLayout } from './WorkbenchLayout';

interface WorkbenchAppProps {
  registryData: any;
  apiUrl: string;
}

export function WorkbenchApp({ registryData, apiUrl }: WorkbenchAppProps) {
  const [config, setConfig] = useState({
    providerId: "",
    modelId: "",
    personaId: "",
    manifestId: "",
    reasoningId: "",
    licenseId: ""
  });

  const handleChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <WorkbenchLayout
      controlPanel={
        <ControlPanel
          providers={registryData.providers || []}
          models={registryData.models || []}
          personas={registryData.personas || []}
          manifests={registryData.manifests || []}
          reasoningProfiles={registryData.reasoning_profiles || []}
          firearmsLicenses={registryData.firearms_licenses || []}
          selected={config}
          onChange={handleChange}
        />
      }
      chatWindow={
        <ChatWindow
          apiUrl={apiUrl}
          config={config}
        />
      }
    />
  );
}
