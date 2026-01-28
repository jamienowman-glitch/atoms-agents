import { NextResponse } from 'next/server';
import { getSystemKey } from '@/lib/vault-server';

const CORE_URL = 'http://localhost:8000';

export async function GET() {
    const systemKey = getSystemKey();
    const res = await fetch(`${CORE_URL}/budget/mtd`, {
        headers: {
            'x-system-key': systemKey
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text || 'Budget fetch failed' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
}
