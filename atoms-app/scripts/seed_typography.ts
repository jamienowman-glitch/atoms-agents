
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { SYSTEM_FONTS } from '../src/lib/fonts/registry-data';

// Load keys from Vault
const VAULT_DIR = '/Users/jaynowman/northstar-keys';
const SUPABASE_URL = fs.readFileSync(path.join(VAULT_DIR, 'supabase-url.txt'), 'utf8').trim();
const SERVICE_KEY = fs.readFileSync(path.join(VAULT_DIR, 'supabase-service-key.txt'), 'utf8').trim();

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false }
});

async function seed() {
    console.log("🌱 Seeding Typography Registry...");

    for (const font of SYSTEM_FONTS) {
        // 1. Create Family
        const { data: family, error: famError } = await supabase
            .from('font_families')
            .upsert({
                name: font.name,
                type: font.type,
                source: font.source,
                weights: font.weights,
                variable_name: font.variable_name
            }, { onConflict: 'name' })
            .select()
            .single();

        if (famError) {
            console.error(`❌ Error creating family ${font.name}:`, famError);
            continue;
        }

        console.log(`✅ Family Processed: ${font.name} (${family.id})`);

        // 2. Clear Old Presets
        await supabase.from('font_presets').delete().eq('family_id', family.id);

        // 3. Insert New Presets
        const presetsPayload = font.presets.map(p => ({
            family_id: family.id,
            name: p.name,
            axes: p.axes
        }));

        const { error: preError } = await supabase
            .from('font_presets')
            .insert(presetsPayload);

        if (preError) {
            console.error(`   ❌ Error inserting presets for ${font.name}:`, preError);
        } else {
            console.log(`   ✨ Seeded ${presetsPayload.length} presets.`);
        }
    }
    console.log("🎉 Typography Seeding Complete.");
}

seed();
