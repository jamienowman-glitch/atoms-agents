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

function loadSecretWithFallback(filename, fallback) {
    const val = loadSecret(filename);
    return val || fallback;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    transpilePackages: ['atoms-ui'],
    env: {
        NEXT_PUBLIC_SUPABASE_URL: loadSecretWithFallback('supabase-url.txt', 'https://placeholder.supabase.co'),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: loadSecretWithFallback('supabase_publishable_api.txt', 'placeholder_key'),
        RESEND_API_KEY: loadSecretWithFallback('resend-key.txt', 're_dummy_123'),
    },
    webpack: (config) => {
        // Resolve critical deps to atoms-app/node_modules to support atoms-ui imports
        config.resolve.alias = {
            ...config.resolve.alias,
            'reactflow': path.resolve(process.cwd(), 'node_modules/reactflow'),
            'wavesurfer.js': path.resolve(process.cwd(), 'node_modules/wavesurfer.js'),
            '@tiptap/react': path.resolve(process.cwd(), 'node_modules/@tiptap/react'),
            '@tiptap/starter-kit': path.resolve(process.cwd(), 'node_modules/@tiptap/starter-kit'),
            '@tsparticles/react': path.resolve(process.cwd(), 'node_modules/@tsparticles/react'),
            '@tsparticles/slim': path.resolve(process.cwd(), 'node_modules/@tsparticles/slim'),
            'idb-keyval': path.resolve(process.cwd(), 'node_modules/idb-keyval'),
            'zustand': path.resolve(process.cwd(), 'node_modules/zustand'),
            'uuid': path.resolve(process.cwd(), 'node_modules/uuid'),
        };
        return config;
    }
};

export default nextConfig;
