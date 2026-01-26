
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load keys from Vault
const VAULT_DIR = '/Users/jaynowman/northstar-keys';
const SUPABASE_URL = fs.readFileSync(path.join(VAULT_DIR, 'supabase-url.txt'), 'utf8').trim();
const SERVICE_KEY = fs.readFileSync(path.join(VAULT_DIR, 'supabase-service-key.txt'), 'utf8').trim();

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function provisionAgent() {
    const email = 'aissistant@squared-agents.app';
    const password = 'agent-password-123!';

    console.log(`[Provisioning] Creating verified user: ${email}...`);

    // Check if exists
    const { data: users } = await supabase.auth.admin.listUsers();
    const existing = users.users.find(u => u.email === email);

    if (existing) {
        console.log(`[Provisioning] User already exists: ${existing.id}`);
        return;
    }

    // Create Verified User
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true // BYPASS EMAIL VERIFICATION
    });

    if (error) {
        console.error('[Provisioning] Error:', error);
    } else {
        console.log(`[Provisioning] Success! Agent ID: ${data.user.id}`);
        console.log('[Provisioning] You can now login with this email/password.');
    }
}

provisionAgent();
