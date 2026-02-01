import React from 'react';
import { WorkbenchApp } from '@/app/workbench/components/WorkbenchApp';

// Force dynamic rendering so we fetch fresh data on navigation
export const dynamic = 'force-dynamic';

async function getRegistryData(apiUrl: string) {
  try {
    const res = await fetch(`${apiUrl}/registry/index`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Failed to fetch registry: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching registry:", error);
    return null;
  }
}

export default async function WorkbenchPage() {
  // Config logic: deploy-time var > localhost default
  const apiUrl = process.env.WORKBENCH_API_URL || "http://localhost:8000";

  const registryData = await getRegistryData(apiUrl);

  if (!registryData) {
    return (
      <div className="p-10 text-red-600">
        <h1 className="text-2xl font-bold">Workbench Error</h1>
        <p>Could not connect to Workbench API at <code>{apiUrl}</code></p>
        <p>Ensure the <code>atoms-agents</code> API service is running.</p>
      </div>
    );
  }

  return <WorkbenchApp registryData={registryData} apiUrl={apiUrl} />;
}
