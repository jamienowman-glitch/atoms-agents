import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('surfaces')
        .select('*')
        .order('key', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function PATCH(req: Request) {
    const supabase = createClient();
    const body = await req.json();
    const { key, space_key } = body;

    const { data, error } = await supabase
        .from('surfaces')
        .update({ space_key })
        .eq('key', key)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
