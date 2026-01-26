
import { NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Load connection string from Vault (Server-side only)
const VAULT_DIR = '/Users/jaynowman/northstar-keys';
const AUTH_FILE = 'supabase-db-url.txt';

export async function POST(request: Request) {
    try {
        const { sql } = await request.json();

        if (!sql) {
            return NextResponse.json({ error: 'SQL query required' }, { status: 400 });
        }

        // Security: In a real app, verify Session/God Claim here.
        // Assuming Middleware handles Auth protection for /api/god/*

        let connectionString;
        try {
            connectionString = fs.readFileSync(path.join(VAULT_DIR, AUTH_FILE), 'utf8').trim();
        } catch (e) {
            return NextResponse.json({ error: 'Database credentials missing from Vault' }, { status: 500 });
        }

        const client = new Client({ connectionString });
        await client.connect();

        try {
            const result = await client.query(sql);
            await client.end();
            return NextResponse.json({
                success: true,
                message: 'Query executed successfully',
                rowCount: result.rowCount,
                rows: result.rows
            });
        } catch (dbError: any) {
            await client.end();
            return NextResponse.json({ error: dbError.message || 'Database execution failed' }, { status: 500 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
