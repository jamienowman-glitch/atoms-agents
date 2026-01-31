'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

export const runtime = 'edge';

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

        // Uses the same logic as atoms-app logic
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
                router.push('/dashboard'); // Microsites might route differently? Defaulting to dashboard/home
                router.refresh();
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono p-4">
            <div className="w-full max-w-sm space-y-8 border border-white/20 p-8">
                <div className="text-center">
                    {/* White-Label Logo & Name */}
                    {process.env.NEXT_PUBLIC_BRAND_LOGO ? (
                        <img src={process.env.NEXT_PUBLIC_BRAND_LOGO} alt="Logo" className="h-12 w-auto mx-auto mb-4" />
                    ) : null}
                    <h1 className="text-2xl font-bold tracking-tighter uppercase">
                        {process.env.NEXT_PUBLIC_BRAND_NAME || 'SYSTEM ACCESS'}
                    </h1>
                    <p className="mt-2 text-xs text-neutral-500 uppercase tracking-widest">Authorized Personnel Only</p>
                </div>

                {message && (
                    <div className="bg-green-500/10 border border-green-500/50 p-4 text-center">
                        <p className="text-green-400 text-xs font-mono">{message}</p>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full border-b border-neutral-800 bg-transparent py-2 px-0 text-sm placeholder-neutral-600 focus:border-white focus:outline-none focus:ring-0 transition-colors"
                                placeholder="OPERATOR ID"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full border-b border-neutral-800 bg-transparent py-2 px-0 text-sm placeholder-neutral-600 focus:border-white focus:outline-none focus:ring-0 transition-colors"
                                placeholder="PASSPHRASE"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-mono text-center">
                            Error: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border border-white bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-all disabled:opacity-50"
                    >
                        {loading ? 'PROCESSING...' : (mode === 'signin' ? `ENTER ${process.env.NEXT_PUBLIC_BRAND_NAME || 'SYSTEM'}` : 'CREATE CREDENTIALS')}
                    </button>

                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-500 pt-4">
                        <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="hover:text-white transition-colors">
                            {mode === 'signin' ? 'Create Account' : 'Back to Login'}
                        </button>
                        <button type="button" className="hover:text-white transition-colors">Recover</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
