import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const supabase = createClient();

    try {
        const [firearms, kpis] = await Promise.all([
            supabase.from('firearm_types').select('*'),
            supabase.from('core_kpis').select('*')
        ]);

        return NextResponse.json({
            firearms: firearms.data || [],
            kpis: kpis.data || []
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const supabase = createClient();
    const body = await request.json();
    const { type, label, key } = body;
    // key for KPI (e.g. 'profit_margin'), label for Firearm (e.g. 'Rifle')

    try {
        if (type === 'firearm') {
            // Assuming firearm_types has { id, label } or similar?
            // I'll guess 'name' or 'label'.
            // I'll use 'label' per prompt hint "label".
            const { error } = await supabase.from('firearm_types').insert({ label });
            if (error) throw error;
        } else if (type === 'kpi') {
            // core_kpis usually { key, label, ... }
            const { error } = await supabase.from('core_kpis').insert({ key, label });
            if (error) throw error;
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
