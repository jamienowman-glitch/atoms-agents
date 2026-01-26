import { NextResponse } from 'next/server';
import { getSecret } from '../../../lib/vault';

export async function GET() {
    const key = getSecret('stripe-publishable-key.txt');
    if (!key) {
        return NextResponse.json({ error: 'Missing Public Key' }, { status: 500 });
    }
    return NextResponse.json({ key });
}
