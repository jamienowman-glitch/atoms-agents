// Stub for the Rig
// Note: We are just proving the structure. Connect transport later.
export const FlowHarness = ({ children }: { children: React.ReactNode }) => (
    <div className="h-screen bg-gray-100 p-4 border-4 border-blue-500 flex flex-col">
        <div className="bg-blue-800 text-white p-2">RIG: Flow Harness</div>
        <div className="flex-1 overflow-auto">{children}</div>
    </div>
);
