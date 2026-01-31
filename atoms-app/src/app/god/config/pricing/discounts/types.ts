export interface KPIConfig {
    slug: string;
    floor: number;
}

export interface DiscountPolicy {
    id?: string;
    tenant_id: string;
    surface_id?: string;
    min_discount_pct: number;
    max_discount_pct: number;
    kpi_ceiling: Record<string, number>; // JSONB in DB
    kpi_floor?: Record<string, number>;
}
