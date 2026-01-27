const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// THE VAULT LAW: Read from /Users/jaynowman/northstar-keys/
const KEYS_DIR = '/Users/jaynowman/northstar-keys';

function getSecret(filename) {
    try {
        const keyPath = path.join(KEYS_DIR, filename);
        if (!fs.existsSync(keyPath)) {
            throw new Error(`Key file not found: ${keyPath}`);
        }
        return fs.readFileSync(keyPath, 'utf8').trim();
    } catch (e) {
        console.error(`❌ Vault Access Error: ${e.message}`);
        process.exit(1);
    }
}

// Load Credentials from Vault
const SUPABASE_URL = getSecret('supabase-url.txt');
const SUPABASE_KEY = getSecret('supabase-service-key.txt');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const CANVASES_DIR = path.resolve('../atoms-ui/canvases');

async function sync() {
    console.log('🔄 Starting Canvas Auto-Linker (Vault Mode)...');

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

            } catch (e) {
                console.error(`   ⚠️ Invalid JSON in ${dir}:`, e.message);
            }
        } else {
            console.log(`   ⚠️ No contract.json in ${dir} (Skipping)`);
        }
    }
    console.log('✨ Sync Complete.');
}

sync();
