import { SupabaseClient } from "@supabase/supabase-js";

export type Surface = {
    id: string;
    key: string;
    name: string;
    description: string;
    config: {
        blurb?: string;
        features?: string[];
        [key: string]: any;
    };
    tenant_id?: string;
};

/**
 * atomic-registry: Fetches all surfaces available to the context.
 * For now, fetches ALL surfaces (Global + Private).
 * @param supabase 
 * @returns List of Surfaces
 */
export async function getSystemSurfaces(supabase: SupabaseClient): Promise<Surface[]> {
    const { data, error } = await supabase
        .from('surfaces')
        .select('*')
        .order('name');

    if (error) {
        console.error("❌ Registry Error:", error);
        return [];
    }
    return data || [];
}
