"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

// Hardcoded God List (In future, check User Role in DB/Claims)
const GODS = ['god@atoms.app', 'jay@atoms.app'];

export default function RootRouter() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const route = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // Check Authorization
            // 1. Is in God List?
            // 1. Is in God List?
            if (user.email && GODS.includes(user.email)) {
                router.push('/god/config');
            } else {
                router.push('/dashboard');
            }
            setLoading(false);
        };
        route();
    }, [router, supabase]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
    );
}
