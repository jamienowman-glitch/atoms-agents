
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const VAULT_DIR = '/Users/jaynowman/northstar-keys';
const AUTH_FILE = 'supabase-db-url.txt';

async function checkDomains() {
    try {
        const connectionString = fs.readFileSync(path.join(VAULT_DIR, AUTH_FILE), 'utf8').trim();
        const client = new Client({ connectionString });
        await client.connect();

        const res = await client.query('SELECT * FROM public.domains');
        console.log("Domains count:", res.rowCount);
        console.log(res.rows);

        await client.end();
    } catch (e) {
        console.error("Error:", e);
    }
}
checkDomains();
