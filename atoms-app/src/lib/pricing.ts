export interface PriceItem {
    id: string;
    service: string;
    unit: string;
    freeLimit: number;
    unitCost: number; // Approximate cost after free tier
    currency: string;
}

export const PRICE_CARD: PriceItem[] = [
    // --- GOOGLE CLOUD ---
    {
        id: 'gcp_cloud_run_req',
        service: 'Cloud Run (Requests)',
        unit: 'Requests',
        freeLimit: 2000000,
        unitCost: 0.0000004, // $0.40 per million
        currency: 'USD'
    },
    {
        id: 'gcp_cloud_run_cpu',
        service: 'Cloud Run (vCPU)',
        unit: 'vCPU-seconds',
        freeLimit: 180000,
        unitCost: 0.000024,
        currency: 'USD'
    },
    {
        id: 'gcp_cloud_run_em',
        service: 'Cloud Run (Memory)',
        unit: 'GiB-seconds',
        freeLimit: 360000,
        unitCost: 0.0000025,
        currency: 'USD'
    },

    // --- SUPABASE ---
    {
        id: 'sb_db_storage',
        service: 'Supabase (DB)',
        unit: 'MB',
        freeLimit: 500,
        unitCost: 0.125, // Pro plan starts at $25 for 8GB? Approx.
        currency: 'USD'
    },
    {
        id: 'sb_auth_mau',
        service: 'Supabase (Auth)',
        unit: 'MAU',
        freeLimit: 50000,
        unitCost: 0.00325,
        currency: 'USD'
    },

    // --- AI MODELS (TOKENS) ---
    {
        id: 'ai_mistral_input',
        service: 'Mistral (Input)',
        unit: '1k Tokens',
        freeLimit: 0, // No free tier on API usually
        unitCost: 0.00025, // Check exact pricing
        currency: 'EUR'
    },
    {
        id: 'ai_openai_gpt4o',
        service: 'GPT-4o',
        unit: '1k Tokens',
        freeLimit: 0,
        unitCost: 0.005,
        currency: 'USD'
    }
];

export function calculateShadowCost(itemId: string, usage: number): number {
    const item = PRICE_CARD.find(i => i.id === itemId);
    if (!item) return 0;

    const billable = Math.max(0, usage - item.freeLimit);
    return billable * item.unitCost;
}

export function getUtilization(itemId: string, usage: number): number {
    const item = PRICE_CARD.find(i => i.id === itemId);
    if (!item || item.freeLimit === 0) return 100; // If no free limit, infinite utilization? Or 0?
    return (usage / item.freeLimit) * 100;
}
