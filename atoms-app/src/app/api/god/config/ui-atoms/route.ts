import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('ui_atoms')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}
