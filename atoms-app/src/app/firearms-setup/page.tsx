"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import QRCode from 'qrcode';

export default function FirearmsSetupPage() {
    const [step, setStep] = useState<'loading' | 'setup' | 'verify' | 'complete'>('loading');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [verifyCode, setVerifyCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        checkExistingSetup();
    }, []);

    const checkExistingSetup = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = '/login';
            return;
        }

        const { data } = await supabase
            .from('human_totp_secrets')
            .select('user_id')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

        if (data) {
            setStep('complete');
        } else {
            generateSecret(user.email || 'User');
        }
    };

    const generateSecret = async (email: string) => {
        // Generate a random base32 secret (20 bytes = 32 chars in base32)
        const array = new Uint8Array(20);
        crypto.getRandomValues(array);
        const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let newSecret = '';
        for (let i = 0; i < 20; i++) {
            newSecret += base32Chars[array[i] % 32];
        }
        setSecret(newSecret);

        // Generate QR code
        const otpAuthUrl = `otpauth://totp/Atoms:${encodeURIComponent(email)}?secret=${newSecret}&issuer=Atoms&algorithm=SHA1&digits=6&period=30`;
        const qr = await QRCode.toDataURL(otpAuthUrl);
        setQrCodeUrl(qr);
        setStep('setup');
    };

    const handleVerify = async () => {
        if (verifyCode.length !== 6) {
            setError('Code must be 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/firearms/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret, verify_code: verifyCode })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Verification failed');
                return;
            }

            setStep('complete');
        } catch (err) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">
                    🔫 Firearms Authenticator
                </h1>
                <p className="text-gray-400 mb-8">
                    Set up two-factor authentication for dangerous actions.
                </p>

                {step === 'loading' && (
                    <div className="text-center text-gray-500 animate-pulse">
                        Loading...
                    </div>
                )}

                {step === 'setup' && (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg flex justify-center">
                            {qrCodeUrl && (
                                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                            )}
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">
                                Scan with Google Authenticator, Authy, or 1Password
                            </p>
                            <p className="text-xs text-gray-600">
                                Manual entry: <code className="bg-gray-900 px-2 py-1 rounded">{secret}</code>
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-2">
                                Enter the 6-digit code from your app to verify setup
                            </label>
                            <input
                                type="text"
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="w-full bg-gray-900 border border-gray-700 p-4 rounded text-center text-2xl font-mono tracking-widest focus:border-green-500 outline-none"
                                maxLength={6}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={isLoading || verifyCode.length !== 6}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded transition-colors uppercase"
                        >
                            {isLoading ? 'Verifying...' : 'Activate Authenticator'}
                        </button>
                    </div>
                )}

                {step === 'complete' && (
                    <div className="text-center space-y-6">
                        <div className="text-6xl">✅</div>
                        <h2 className="text-xl font-bold">Authenticator Active</h2>
                        <p className="text-gray-400">
                            When an agent needs a Firearms license, enter a code from your authenticator app.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-left text-sm font-mono">
                            <p className="text-gray-500 mb-2"># Example grant command:</p>
                            <p className="text-green-400">FIREARMS: 847291 AD_SPEND_EXECUTE</p>
                        </div>
                        <a
                            href="/dashboard"
                            className="inline-block bg-white text-black px-6 py-3 rounded font-bold uppercase hover:bg-gray-200 transition-colors"
                        >
                            Back to Dashboard
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
