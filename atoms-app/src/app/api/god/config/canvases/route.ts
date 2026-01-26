import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// GET: List all Canvases
export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('canvases')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

// POST: Create (Forge) new Canvas
export async function POST(req: Request) {
    const supabase = createClient();
    try {
        const body = await req.json();

        // BasicValidation
        if (!body.key || !body.name || !body.structure) {
            return NextResponse.json({ error: 'Missing required fields: key, name, structure' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('canvases')
            .insert(body)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }
}
