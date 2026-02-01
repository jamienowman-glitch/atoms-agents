import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Service Role key would be ideal, but for now using standard env)
// Ideally this route runs in a secure context.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const KEY_STORAGE_PATH = '/Users/jaynowman/northstar-keys';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, driver, secret_key } = body;

        if (!name || !driver || !secret_key) {
            return NextResponse.json(
                { error: 'Missing required fields: name, driver, secret_key' },
                { status: 400 }
            );
        }

        // 1. Ensure storage directory exists
        if (!fs.existsSync(KEY_STORAGE_PATH)) {
            fs.mkdirSync(KEY_STORAGE_PATH, { recursive: true });
        }

        // 2. Generate Secure Filename (Canonical)
        // Use the Naming Engine to ensure deterministic lookup by Muscles
        // "Marketplace Solana Wallet" -> "MARKETPLACE_SOLANA_WALLET.key"

        // Import canonical naming logic (ported from lib/engines/naming-engine.ts)
        // Since we are in an API route, let's keep it simple and consistent.
        // Logic: slugify -> uppercase -> underscores
        const canonicalName = name.trim().toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .toUpperCase();

        const vaultFilename = `${canonicalName}.key`;
        const fullPath = path.join(KEY_STORAGE_PATH, vaultFilename);

        // 3. Write Secret to Disk
        // Permissions: 600 (Read/Write for owner only)
        // Overwrite if exists (standard behavior for updating keys)
        fs.writeFileSync(fullPath, secret_key, { encoding: 'utf-8', mode: 0o600 });

        // 4. Save Metadata to DB
        const { data, error } = await supabase
            .from('infrastructure_providers')
            .insert([
                {
                    name,
                    driver,
                    vault_filename: vaultFilename
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            // Rollback: delete the key file if DB insert fails
            fs.unlinkSync(fullPath);
            return NextResponse.json(
                { error: 'Database Insert Failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, provider: data });

    } catch (error) {
        console.error('[Vault API] Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
