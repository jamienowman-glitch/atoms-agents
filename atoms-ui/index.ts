// export * from './harness/ToolHarness';
// export * from './harness/ToolControlProvider'; // Duplicate of ToolDefinition export? 
// Actually, looking at the error: "Module './harness/ToolControlProvider' has already exported a member named 'ToolDefinition'".
// It seems ToolHarness or ToolControlProvider exports might be conflicting or re-exporting.
// Let's comment this out if it's redundant, or inspect ToolHarness. 
// export * from './harness/ToolControlProvider';
// export * from './harness/ChatContext';

export * from './types/ToolEvent';
export * from './types/CanvasContext';

export * from './harnesses/Mother/tool-areas/TopPill/TopPill';
export * from './harnesses/Mother/tool-areas/ToolPill/ToolPill';
export * from './harnesses/Mother/tool-areas/ToolPop/ToolPop';
export * from './harnesses/Mother/tool-areas/ChatRail/ChatRail';
// export * from './harness/registry/client';
// export * from './harness/console/SurfaceCard';
// export * from './harness/console/LauncherGrid';

export * from './canvases/haze';
// export * from './canvases/draft_harness';
