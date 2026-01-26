import fs from 'fs';
import path from 'path';

// Standard Vault Location
const VAULT_PATH = '/Users/jaynowman/northstar-keys';

/**
 * Reads a secret from the local Vault.
 * @param filename The exact filename (e.g. 'stripe-secret-key.txt')
 * @returns The trimmed content of the key file
 */
export function getSecret(filename: string): string | null {
    try {
        const filePath = path.join(VAULT_PATH, filename);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf-8').trim();
        }
        console.warn(`⚠️ Vault Warning: Key file '${filename}' not found in ${VAULT_PATH}`);
        return null;
    } catch (error) {
        console.error(`❌ Vault Error reading ${filename}:`, error);
        return null;
    }
}
