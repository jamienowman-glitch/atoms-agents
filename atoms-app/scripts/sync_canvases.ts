import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load ENV from local .env.local
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase Credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const CANVASES_DIR = path.resolve('../atoms-ui/canvases');

async function sync() {
    console.log('🔄 Starting Canvas Auto-Linker...');

    if (!fs.existsSync(CANVASES_DIR)) {
        console.error(`❌ Canvas Directory not found: ${CANVASES_DIR}`);
        return;
    }

    const dirs = fs.readdirSync(CANVASES_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    console.log(`📂 Found ${dirs.length} potential canvases: ${dirs.join(', ')}`);

    for (const dir of dirs) {
        const contractPath = path.join(CANVASES_DIR, dir, 'contract.json');

        if (fs.existsSync(contractPath)) {
            console.log(`   ✅ Found contract for: ${dir}`);
            try {
                const contract = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));

                // Upsert to DB
                const payload = {
                    key: contract.meta.key || dir,
                    name: contract.meta.name,
                    description: contract.meta.description,
                    structure: contract, // Save full JSON
                    status: 'live'
                };

                const { error } = await supabase
                    .from('canvases')
                    .upsert(payload, { onConflict: 'key' });

                if (error) {
                    console.error(`   ❌ DB Sync Failed for ${dir}:`, error.message);
                } else {
                    console.log(`   🚀 LINKED: ${dir}`);
                }

            } catch (e: any) {
                console.error(`   ⚠️ Invalid JSON in ${dir}:`, e.message);
            }
        } else {
            console.log(`   ⚠️ No contract.json in ${dir} (Skipping)`);
        }
    }
    console.log('✨ Sync Complete.');
}

sync();
