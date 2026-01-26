import fs from 'fs';
import path from 'path';

function loadSecret(filename) {
    try {
        // Hardcoded vault path as per Northstar Standard
        // In production, this would be a mount path or GSM call
        const vaultPath = '/Users/jaynowman/northstar-keys';
        return fs.readFileSync(path.join(vaultPath, filename), 'utf8').trim();
    } catch (e) {
        console.warn(`WARNING: Could not load secret ${filename} from vault.`);
        return '';
    }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['atoms-ui'],
    env: {
        NEXT_PUBLIC_SUPABASE_URL: loadSecret('supabase-url.txt'),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: loadSecret('supabase_publishable_api.txt'),
        RESEND_API_KEY: loadSecret('resend-key.txt'),
    },
    webpack: (config) => {
        return config;
    }
};

export default nextConfig;
