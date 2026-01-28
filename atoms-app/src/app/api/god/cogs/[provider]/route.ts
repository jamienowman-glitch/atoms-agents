import { NextResponse } from 'next/server';
import { getSystemKey } from '@/lib/vault-server';

const CORE_URL = 'http://localhost:8000';

export async function GET(_request: Request, { params }: { params: { provider: string } }) {
    const systemKey = getSystemKey();
    const provider = params.provider;
    const res = await fetch(`${CORE_URL}/budget/${provider}/breakdown`, {
        headers: {
            'x-system-key': systemKey
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text || 'Breakdown fetch failed' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
}
