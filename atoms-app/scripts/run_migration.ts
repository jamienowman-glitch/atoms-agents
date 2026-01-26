
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
        console.log("Connecting to Database...");
        await client.connect();

        // Read SQL file
        const sqlFile = process.argv[2];
        if (!sqlFile) {
            console.error("❌ Please provide an SQL file path as an argument.");
            process.exit(1);
        }

        // Resolve absolute path if needed, or use as is if absolute
        const sqlPath = path.isAbsolute(sqlFile)
            ? sqlFile
            : path.join(process.cwd(), sqlFile);

        if (!fs.existsSync(sqlPath)) {
            console.error(`❌ SQL file not found: ${sqlPath}`);
            process.exit(1);
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log(`Running migration: ${path.basename(sqlPath)}...`);
        await client.query(sql);
        console.log(`✅ Migration ${path.basename(sqlPath)} executed successfully.`);
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await client.end();
    }
}

migrate();
