import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('name');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const supabase = createClient();

    const body = await req.json();
    const { key, name, description } = body;

    const { data, error } = await supabase
        .from('spaces')
        .insert([{ key, name, description }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
