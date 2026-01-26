
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Load connection string from Vault
const VAULT_DIR = '/Users/jaynowman/northstar-keys';
const AUTH_FILE = 'supabase-db-url.txt';

async function migrate() {
    let connectionString;
    try {
        connectionString = fs.readFileSync(path.join(VAULT_DIR, AUTH_FILE), 'utf8').trim();
    } catch (e) {
        console.error(`❌ Could not read ${AUTH_FILE} from vault.`);
        process.exit(1);
    }

    const client = new Client({ connectionString });

    try {
        await client.connect();

        // Read SQL file
        const sqlPath = '/Users/jaynowman/dev/atoms-core/sql/002_add_typography_registry.sql';
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log(`Running migration: ${path.basename(sqlPath)}...`);
        await client.query(sql);
        console.log("✅ Migration successful.");
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await client.end();
    }
}

migrate();
