export function getSecret(filename: string): string | null {
    // 1. Try Environment Variable (Priority for Edge/Production)
    // Example: 'stripe-secret-key.txt' -> 'STRIPE_SECRET_KEY'
    const envKey = filename
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_') // Replace non-alphanumeric with _
        .replace(/_TXT$/, '');      // Remove .TXT suffix

    if (process.env[envKey]) {
        return process.env[envKey]!;
    }

    // 2. Try Local Vault (Node.js Only - Local Dev)
    // Wrapped in try/catch and runtime check to avoid Edge build errors
    try {
        // @ts-ignore
        if (process.env.NEXT_RUNTIME !== 'edge' && typeof window === 'undefined') {
            // Use dynamic require to bypass static analysis for 'fs' in Edge
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const fs = require('fs');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const path = require('path');

            const VAULT_PATH = '/Users/jaynowman/northstar-keys';
            const filePath = path.join(VAULT_PATH, filename);

            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, 'utf-8').trim();
            }

            console.warn(`⚠️ Vault Warning: Key file '${filename}' not found in ${VAULT_PATH}`);
        }
    } catch (error) {
        // Ignore errors in environments where fs is not available
    }

    return null;
}
