"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface ApproveButtonProps {
    providerId: string;
}

export const ApproveButton: React.FC<ApproveButtonProps> = ({ providerId }) => {
    const supabase = createClient();
    const [stats, setStats] = useState({
        pendingKpis: 0,
        pendingMetrics: 0,
        pendingUtms: 0,
        totalMappings: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (providerId) {
            checkStatus();
        }
    }, [providerId]);

    const checkStatus = async () => {
        // We want to count unapproved items
        const [kpiRes, metricRes, utmRes] = await Promise.all([
            supabase.from('kpi_mappings').select('is_approved', { count: 'exact' }).eq('provider_id', providerId),
            supabase.from('metric_mappings').select('is_approved', { count: 'exact' }).eq('provider_id', providerId),
            supabase.from('utm_templates').select('is_approved', { count: 'exact' }).eq('provider_id', providerId)
        ]);

        const kpis = kpiRes.data || [];
        const metrics = metricRes.data || [];
        const utms = utmRes.data || [];

        const pendingKpis = kpis.filter((x: any) => !x.is_approved).length;
        const pendingMetrics = metrics.filter((x: any) => !x.is_approved).length;
        const pendingUtms = utms.filter((x: any) => !x.is_approved).length;

        setStats({
            pendingKpis,
            pendingMetrics,
            pendingUtms,
            totalMappings: kpis.length + metrics.length + utms.length
        });
    };

    const approveAll = async () => {
        if (!confirm('Are you sure you want to APPROVE all mappings for this connector? This will enable them for production use.')) return;

        setLoading(true);
        await Promise.all([
            supabase.from('kpi_mappings').update({ is_approved: true }).eq('provider_id', providerId),
            supabase.from('metric_mappings').update({ is_approved: true }).eq('provider_id', providerId),
            supabase.from('utm_templates').update({ is_approved: true }).eq('provider_id', providerId)
        ]);

        await checkStatus();
        setLoading(false);
        alert('Connector mappings APPROVED.');
    };

    const isFullyApproved = stats.totalMappings > 0 && stats.pendingKpis === 0 && stats.pendingMetrics === 0 && stats.pendingUtms === 0;
    const hasPending = stats.pendingKpis > 0 || stats.pendingMetrics > 0 || stats.pendingUtms > 0;

    return (
        <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
                <div className="text-[10px] uppercase font-bold text-neutral-400 leading-tight">Status</div>
                <div className={`text-xs uppercase font-black ${isFullyApproved ? 'text-green-500' : 'text-yellow-500'}`}>
                    {isFullyApproved ? 'APPROVED' : 'DRAFT / PENDING'}
                </div>
            </div>

            <button
                onClick={approveAll}
                disabled={loading || !hasPending}
                className={`px-4 py-2 text-xs font-black uppercase border-2 tracking-wide transition-all
                    ${hasPending
                        ? 'border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600'
                        : 'border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    }
                `}
            >
                {loading ? 'APPROVING...' : 'APPROVE ALL'}
            </button>
        </div>
    );
};
