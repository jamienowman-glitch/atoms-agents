import fs from 'fs';
import path from 'path';

const VAULT_DIR = '/Users/jaynowman/northstar-keys';

export function readVaultText(filename: string): string | null {
    const fullPath = path.join(VAULT_DIR, filename);
    if (!fs.existsSync(fullPath)) return null;
    const contents = fs.readFileSync(fullPath, 'utf8').trim();
    return contents || null;
}

export function getSystemKey(): string {
    const fromVault = readVaultText('system-key.txt');
    if (fromVault) return fromVault;
    return 'test_system_key';
}
