
// INLINED FROM lib/utils/edge-id.ts TO AVOID TS-NODE MODULE RESOLUTION ISSUES
const generateEdgeId = (
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

console.log('Running Edge ID Verification (Standalone)...');

const testCases = [
    { src: 'node1', tgt: 'node2', srcH: 'out', tgtH: 'in' },
    { src: 'node1', tgt: 'node2', srcH: 'out', tgtH: 'in' }, // Exact Duplicate
    { src: 'node1', tgt: 'node2', srcH: 'a', tgtH: 'b' },     // Different Handles
    { src: 'node2', tgt: 'node1', srcH: 'out', tgtH: 'in' },   // Reversed
];

const results = testCases.map(tc => {
    const id = generateEdgeId(tc.src, tc.tgt, tc.srcH, tc.tgtH);
    console.log(`[${tc.src}:${tc.srcH} -> ${tc.tgt}:${tc.tgtH}] = ${id}`);
    return id;
});

if (results[0] === results[1]) {
    console.log('✅ PASS: Deterministic IDs match');
} else {
    console.error('❌ FAIL: Deterministic IDs do not match');
    process.exit(1);
}

if (results[0] !== results[2]) {
    console.log('✅ PASS: Different handles produce different IDs');
} else {
    console.error('❌ FAIL: Different handles produced same ID');
    process.exit(1);
}

console.log('✅ Verification Complete');
