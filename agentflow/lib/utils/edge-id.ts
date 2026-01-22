/**
 * Generates a deterministic Edge ID based on the source and target connection points.
 * 
 * The format is a hash of: "source:sourceHandle->target:targetHandle"
 * This ensures that if the same connection is made again, the ID is identical,
 * which is critical for restoring "Blackboard" memory associated with that edge.
 * 
 * @param source Node ID of the source
 * @param target Node ID of the target
 * @param sourceHandle Optional handle ID on the source node
 * @param targetHandle Optional handle ID on the target node
 * @returns A deterministic string ID
 */
export const generateEdgeId = (
    source: string,
    target: string,
    sourceHandle: string = 'default',
    targetHandle: string = 'default'
): string => {
    // Construct the canonical connection string
    const connectionString = `${source}:${sourceHandle}->${target}:${targetHandle}`;

    // Simple FNV-1a like hash for deterministic ID (client-side safe, no crypto lib dependency)
    let hash = 0x811c9dc5;
    for (let i = 0; i < connectionString.length; i++) {
        hash ^= connectionString.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }

    // Convert to hex and ensure positive
    const hashHex = (hash >>> 0).toString(16).padStart(8, '0');

    return `edge-${hashHex}`;
};
