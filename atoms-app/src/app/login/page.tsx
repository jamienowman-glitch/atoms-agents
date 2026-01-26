"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { createClient } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const action = mode === 'signup'
            ? supabase.auth.signUp({ email, password })
            : supabase.auth.signInWithPassword({ email, password });

        const { error } = await action;

        if (error) {
            setError(error.message);
        } else {
            if (mode === 'signup') {
                setMessage("Account created. Please check email to confirm.");
                setMode('signin');
            } else {
                router.push('/');
                router.refresh();
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo - No Text */}
                <div className="mb-12 flex justify-center">
                    <div className="relative w-64 h-24">
                        <Image
                            src="/atoms-logo.png"
                            alt="Atoms Fam Orchestration System"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {message && (
                    <div className="mb-6 bg-blue-500/10 border border-blue-500/50 p-4 text-center">
                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Status Update</p>
                        <p className="text-blue-400 text-sm font-mono">{message}</p>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-white transition-colors text-sm font-mono"
                        placeholder="EMAIL"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-white transition-colors text-sm font-mono"
                        placeholder="PASSWORD"
                        required
                    />

                    {error && (
                        <div className="text-red-500 text-xs font-mono">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold text-xs tracking-widest py-4 hover:bg-neutral-200 transition-colors uppercase"
                    >
                        {loading ? '...' : (mode === 'signin' ? 'Enter System' : 'Create Credentials')}
                    </button>
                </form>

                <div className="mt-8 flex justify-between text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                    <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="hover:text-white transition-colors">
                        {mode === 'signin' ? 'Create Account' : 'Back to Login'}
                    </button>
                    <button className="hover:text-white transition-colors">Recover</button>
                </div>
            </div>
        </div>
    );
}
