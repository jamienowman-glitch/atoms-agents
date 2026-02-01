import { NextRequest, NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SetupRequest {
    secret: string;
    verify_code: string;
}

function encryptSecret(secret: string): string {
    // In production: Use proper encryption (e.g., AES-256-GCM with Vault key)
    // For MVP: Base64 encode
    // TODO: Implement proper encryption with Vault master key
    return Buffer.from(secret, 'utf-8').toString('base64');
}

export async function POST(request: NextRequest) {
    try {
        // 1. Get authenticated user from session
        const authHeader = request.headers.get('authorization');
        const cookieHeader = request.headers.get('cookie');

        // For browser-based requests, get session from cookies
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request
        const body: SetupRequest = await request.json();
        const { secret, verify_code } = body;

        if (!secret || !verify_code) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 3. Validate the TOTP code before storing
        const totp = new OTPAuth.TOTP({
            issuer: 'Atoms',
            label: user.email || 'User',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(secret)
        });

        const delta = totp.validate({ token: verify_code, window: 1 });
        if (delta === null) {
            return NextResponse.json(
                { error: 'Invalid verification code. Please try again.' },
                { status: 400 }
            );
        }

        // 4. Encrypt and store the secret
        const encryptedSecret = encryptSecret(secret);

        const { error: insertError } = await supabase
            .from('human_totp_secrets')
            .upsert({
                user_id: user.id,
                encrypted_secret: encryptedSecret,
                is_active: true,
                created_at: new Date().toISOString()
            });

        if (insertError) {
            console.error('[Firearms Setup] Error:', insertError);
            return NextResponse.json(
                { error: 'Failed to save authenticator' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Firearms Authenticator activated'
        });

    } catch (error) {
        console.error('[Firearms Setup] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
