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

// POST: Create new Canvas
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

// PUT: Update existing Canvas (by id or key)
export async function PUT(req: Request) {
    const supabase = createClient();
    try {
        const body = await req.json();

        if ((!body.id && !body.key) || !body.structure) {
            return NextResponse.json({ error: 'Missing required fields: id or key, structure' }, { status: 400 });
        }

        const query = supabase.from('canvases').update({
            name: body.name,
            description: body.description,
            structure: body.structure
        });

        const { data, error } = body.id
            ? await query.eq('id', body.id).select().single()
            : await query.eq('key', body.key).select().single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }
}
