import { NextRequest, NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';
import * as jose from 'jose';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Service Role for DB access)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT Secret for signing tickets (should be in Vault)
const JWT_SECRET = new TextEncoder().encode(
    process.env.FIREARMS_JWT_SECRET || 'REPLACE_WITH_VAULT_SECRET'
);

// Master key for decrypting TOTP secrets (should be in Vault)
const MASTER_KEY = process.env.FIREARMS_MASTER_KEY || 'REPLACE_WITH_VAULT_MASTER_KEY';

interface VerifyRequest {
    totp_code: string;
    license_key: string;
    agent_id: string;
    scope_context?: Record<string, string>;
}

function decryptSecret(encrypted: string): string {
    // In production: Use proper encryption (e.g., AES-256-GCM with Vault key)
    // For MVP: Simple XOR or Base64 decode
    // TODO: Implement proper decryption with Vault master key
    return Buffer.from(encrypted, 'base64').toString('utf-8');
}

export async function POST(request: NextRequest) {
    try {
        // 1. Get authenticated user
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        // 2. Parse request body
        const body: VerifyRequest = await request.json();
        const { totp_code, license_key, agent_id, scope_context } = body;

        if (!totp_code || !license_key || !agent_id) {
            return NextResponse.json(
                { error: 'Missing required fields: totp_code, license_key, agent_id' },
                { status: 400 }
            );
        }

        // 3. Get user's TOTP secret
        const { data: secretRow, error: secretError } = await supabase
            .from('human_totp_secrets')
            .select('encrypted_secret')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

        if (secretError || !secretRow) {
            return NextResponse.json(
                { error: 'TOTP not set up. Please visit /firearms-setup first.' },
                { status: 403 }
            );
        }

        // 4. Decrypt and validate TOTP
        const secret = decryptSecret(secretRow.encrypted_secret);
        const totp = new OTPAuth.TOTP({
            issuer: 'Atoms',
            label: user.email || 'User',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(secret)
        });

        const delta = totp.validate({ token: totp_code, window: 1 });
        if (delta === null) {
            return NextResponse.json(
                { error: 'Invalid or expired TOTP code' },
                { status: 401 }
            );
        }

        // 5. Verify license exists
        const { data: licenseRow, error: licenseError } = await supabase
            .from('firearms_licenses')
            .select('license_key')
            .eq('license_key', license_key)
            .single();

        if (licenseError || !licenseRow) {
            return NextResponse.json(
                { error: `Unknown license: ${license_key}` },
                { status: 400 }
            );
        }

        // 6. Create short-lived JWT ticket
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        const ticket = await new jose.SignJWT({
            agent_id,
            license_key,
            granted_by: user.id,
            scope_context: scope_context || {}
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(expiresAt)
            .setIssuer('atoms-firearms')
            .sign(JWT_SECRET);

        // 7. Store grant in database (for audit)
        // Compute Merkle hash for blockchain anchoring
        const crypto = await import('crypto');
        const merkleData = `${agent_id}|${license_key}|${user.id}|${expiresAt.toISOString()}`;
        const merkleHash = crypto.createHash('sha256').update(merkleData).digest('hex');

        const { error: insertError } = await supabase
            .from('agent_firearms_grants')
            .insert({
                agent_id,
                license_key,
                granted_by: user.id,
                expires_at: expiresAt.toISOString(),
                ticket_jwt: ticket,
                scope_context: scope_context || {},
                merkle_hash: merkleHash  // For Merkle Man audit
            });

        if (insertError) {
            console.error('[Firearms] Grant insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to record grant' },
                { status: 500 }
            );
        }

        // 8. Update last_used timestamp
        await supabase
            .from('human_totp_secrets')
            .update({ last_used_at: new Date().toISOString() })
            .eq('user_id', user.id);

        // 9. Return ticket
        return NextResponse.json({
            success: true,
            ticket,
            expires_at: expiresAt.toISOString(),
            expires_in: 900, // seconds
            license_key,
            agent_id
        });

    } catch (error) {
        console.error('[Firearms] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
