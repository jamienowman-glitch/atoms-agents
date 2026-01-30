"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

// TYPES
type PricingRow = {
    id: string;
    tool_key: string;
    base_price_snax: number;
    price_model: string;
    active: boolean;
};

type SystemConfig = {
    snax_exchange: {
        USD: number;
        GBP: number;
        EUR: number;
    };
    crypto_bonus_pct: number;
};

type DiscountPolicy = {
    id: string;
    tenant_id: string;
    surface_id: string;
    min_discount_pct: number;
    max_discount_pct: number;
    monthly_discount_cap_pct_of_turnover: number;
    kpi_ceiling: { discount_rate: number };
    kpi_floor: { discount_rate: number };
};

export default function PricingConfigPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // DATA STATE
    const [pricing, setPricing] = useState<PricingRow[]>([]);
    const [config, setConfig] = useState<SystemConfig>({
        snax_exchange: { USD: 0, GBP: 0, EUR: 0 },
        crypto_bonus_pct: 0
    });

    // DISCOUNT STATE
    const [policies, setPolicies] = useState<DiscountPolicy[]>([]);
    const [selectedSurface, setSelectedSurface] = useState<string>('default');

    // 1. FETCH DATA
    const fetchData = async () => {
        setLoading(true);

        // A. Fetch Pricing
        const { data: pricingData } = await supabase
            .from('pricing')
            .select('*')
            .order('tool_key');

        if (pricingData) setPricing(pricingData);

        // B. Fetch System Config (Exchange + Bonus)
        const { data: configData } = await supabase
            .from('system_config')
            .select('*')
            .in('key', ['snax_exchange', 'crypto_bonus_pct']);

        if (configData) {
            const newConfig = { ...config };
            configData.forEach((row: any) => {
                if (row.key === 'snax_exchange') newConfig.snax_exchange = row.value;
                if (row.key === 'crypto_bonus_pct') newConfig.crypto_bonus_pct = row.value;
            });
            setConfig(newConfig);
        }

        // C. Fetch Discount Policies
        const { data: policyData } = await supabase
            .from('discount_policy')
            .select('*');

        if (policyData) setPolicies(policyData);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. HANDLERS
    const handleExchangeChange = (currency: 'USD' | 'GBP' | 'EUR', val: string) => {
        setConfig(prev => ({
            ...prev,
            snax_exchange: {
                ...prev.snax_exchange,
                [currency]: Number(val)
            }
        }));
    };

    const handleBonusChange = (val: string) => {
        setConfig(prev => ({
            ...prev,
            crypto_bonus_pct: Number(val)
        }));
    };

    const handlePriceChange = (id: string, val: string) => {
        setPricing(prev => prev.map(row =>
            row.id === id ? { ...row, base_price_snax: Number(val) } : row
        ));
    };

    const toggleActive = (id: string, current: boolean) => {
        setPricing(prev => prev.map(row =>
            row.id === id ? { ...row, active: !current } : row
        ));
    };

    // DISCOUNT HANDLERS
    const activePolicy = policies.find(p => p.surface_id === selectedSurface);

    const handlePolicyChange = (field: keyof DiscountPolicy | string, val: any) => {
        if (!activePolicy) return;

        setPolicies(prev => prev.map(p => {
            if (p.surface_id !== selectedSurface) return p;

            // Handle nested objects
            if (field === 'kpi_ceiling.discount_rate') {
                return { ...p, kpi_ceiling: { ...p.kpi_ceiling, discount_rate: Number(val) } };
            }
            if (field === 'kpi_floor.discount_rate') {
                return { ...p, kpi_floor: { ...p.kpi_floor, discount_rate: Number(val) } };
            }

            return { ...p, [field]: Number(val) };
        }));
    };

    // 3. SAVE
    const saveAll = async () => {
        setSaving(true);
        try {
            // A. Save Config
            await supabase.from('system_config').upsert([
                { key: 'snax_exchange', value: config.snax_exchange },
                { key: 'crypto_bonus_pct', value: config.crypto_bonus_pct }
            ]);

            // B. Save Pricing
            // Upsert all modified rows
            const updates = pricing.map(p => ({
                id: p.id,
                tool_key: p.tool_key,
                base_price_snax: p.base_price_snax,
                active: p.active,
                price_model: p.price_model
            }));

            const { error: pricingError } = await supabase.from('pricing').upsert(updates);
            if (pricingError) throw pricingError;

            // C. Save Discount Policies
            const { error: policyError } = await supabase.from('discount_policy').upsert(policies);
            if (policyError) throw policyError;

            alert('SAVED SUCCESSFULLY');
        } catch (e: any) {
            console.error(e);
            alert('SAVE FAILED: ' + e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 p-4 md:p-12 font-mono text-sm">

            {/* TOP BAR */}
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase">SNAX & PRICING DASHBOARD</h1>
                    <p className="text-neutral-500">EXCHANGE RATES · TOOL COSTS · DISCOUNT GOVERNANCE</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => router.back()} className="px-6 py-2 border-2 border-black hover:bg-white uppercase font-bold">
                        Back
                    </button>
                    <button
                        onClick={saveAll}
                        disabled={saving}
                        className="px-6 py-2 bg-black text-white hover:opacity-80 uppercase font-bold"
                    >
                        {saving ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="max-w-7xl mx-auto p-12 text-center">LOADING DATA...</div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COL 1: EXCHANGE LOGIC */}
                    <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-fit">
                        <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-black pb-2">1. EXCHANGE LOGIC</h2>

                        <div className="space-y-6">
                            {/* FIAT */}
                            <div>
                                <label className="block font-bold mb-2">SNAX PER 1 UNIT FIAT</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <span className="block text-xs text-neutral-500 mb-1">USD</span>
                                        <input
                                            type="number"
                                            value={config.snax_exchange.USD}
                                            onChange={(e) => handleExchangeChange('USD', e.target.value)}
                                            className="w-full border-2 border-neutral-200 p-2 focus:border-black outline-none font-bold"
                                        />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-neutral-500 mb-1">GBP</span>
                                        <input
                                            type="number"
                                            value={config.snax_exchange.GBP}
                                            onChange={(e) => handleExchangeChange('GBP', e.target.value)}
                                            className="w-full border-2 border-neutral-200 p-2 focus:border-black outline-none font-bold"
                                        />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-neutral-500 mb-1">EUR</span>
                                        <input
                                            type="number"
                                            value={config.snax_exchange.EUR}
                                            onChange={(e) => handleExchangeChange('EUR', e.target.value)}
                                            className="w-full border-2 border-neutral-200 p-2 focus:border-black outline-none font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CRYPTO */}
                            <div>
                                <label className="block font-bold mb-2">CRYPTO DEPOSIT BONUS (%)</label>
                                <input
                                    type="number"
                                    value={config.crypto_bonus_pct}
                                    onChange={(e) => handleBonusChange(e.target.value)}
                                    className="w-full border-2 border-neutral-200 p-2 focus:border-black outline-none font-bold"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    Extra Snax granted for crypto deposits (e.g. 20 = 20% bonus).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* COL 2: TOOL PRICING */}
                    <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-fit">
                        <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-black pb-2">2. TOOL PRICING</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-black text-xs uppercase text-neutral-500">
                                        <th className="py-2 px-2">KEY</th>
                                        <th className="py-2 px-2 text-right">PRICE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricing.map((row) => (
                                        <tr key={row.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleActive(row.id, row.active)}
                                                        className={`w-3 h-3 border border-black ${row.active ? 'bg-green-500' : 'bg-red-500'}`}
                                                    />
                                                    <span className="font-bold text-xs truncate max-w-[120px]" title={row.tool_key}>
                                                        {row.tool_key.replace('muscle-', '')}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-neutral-400 uppercase">{row.price_model}</span>
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <input
                                                    type="number"
                                                    value={row.base_price_snax}
                                                    onChange={(e) => handlePriceChange(row.id, e.target.value)}
                                                    className="w-20 text-right border border-neutral-300 p-1 focus:border-black outline-none"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {pricing.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-neutral-400 italic">
                                                NO TOOLS FOUND IN REGISTRY
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* COL 3: DISCOUNT POLICY */}
                    <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-fit">
                        <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-black pb-2">3. DISCOUNT GOVERNANCE</h2>

                        {/* SURFACE SELECTOR */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-neutral-500 mb-1">SURFACE SCOPE</label>
                            <select
                                value={selectedSurface}
                                onChange={(e) => setSelectedSurface(e.target.value)}
                                className="w-full border-2 border-black p-2 font-bold uppercase bg-neutral-100"
                            >
                                <option value="default">DEFAULT SURFACE</option>
                                {/* Add more surfaces here dynamically if needed */}
                            </select>
                        </div>

                        {activePolicy ? (
                            <div className="space-y-6">
                                {/* LIMITS */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">MIN DISCOUNT (%)</label>
                                        <input
                                            type="number" step="0.01"
                                            value={activePolicy.min_discount_pct}
                                            onChange={(e) => handlePolicyChange('min_discount_pct', e.target.value)}
                                            className="w-full border-2 border-neutral-200 p-2 focus:border-black outline-none font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">MAX DISCOUNT (%)</label>
                                        <input
                                            type="number" step="0.01"
                                            value={activePolicy.max_discount_pct}
                                            onChange={(e) => handlePolicyChange('max_discount_pct', e.target.value)}
                                            className="w-full border-2 border-neutral-200 p-2 focus:border-black outline-none font-bold"
                                        />
                                    </div>
                                </div>

                                {/* FLOOR/CEILING */}
                                <div className="p-4 bg-neutral-50 border border-neutral-200">
                                    <h4 className="font-bold text-xs uppercase mb-3 text-neutral-500">KPI GUARDRAILS</h4>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs mb-1">AVG RATE CEILING (Fail if &gt; this)</label>
                                            <input
                                                type="number" step="0.01"
                                                value={activePolicy.kpi_ceiling?.discount_rate ?? 0.4}
                                                onChange={(e) => handlePolicyChange('kpi_ceiling.discount_rate', e.target.value)}
                                                className="w-full border border-neutral-300 p-1 focus:border-black outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">AVG RATE FLOOR (Fail if &lt; this)</label>
                                            <input
                                                type="number" step="0.01"
                                                value={activePolicy.kpi_floor?.discount_rate ?? 0.05}
                                                onChange={(e) => handlePolicyChange('kpi_floor.discount_rate', e.target.value)}
                                                className="w-full border border-neutral-300 p-1 focus:border-black outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-neutral-100 border-2 border-dashed border-neutral-300">
                                <p className="text-neutral-400 font-bold">NO POLICY FOUND FOR SURFACE</p>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
