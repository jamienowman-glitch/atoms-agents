'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const runtime = 'edge';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Stub: Log to console
        console.log('Login Attempt:', { email, password });

        // Stub: Redirect to admin
        setTimeout(() => {
            router.push('/admin');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono p-4">
            <div className="w-full max-w-sm space-y-8 border border-white/20 p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tighter uppercase">System Access</h1>
                    <p className="mt-2 text-xs text-neutral-500 uppercase tracking-widest">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border border-white bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-all disabled:opacity-50"
                    >
                        {loading ? 'AUTHENTICATING...' : 'ENTER SYSTEM'}
                    </button>
                </form>
            </div>
        </div>
    );
}
