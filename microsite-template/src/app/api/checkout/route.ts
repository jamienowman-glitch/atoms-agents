import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSecret } from '@/lib/vault';

export async function POST(req: Request) {
    const secretKey = getSecret('stripe-secret-key.txt');

    if (!secretKey) {
        return NextResponse.json({ error: "Stripe Not Configured (Missing Key in Vault)" }, { status: 500 });
    }

    const stripe = new Stripe(secretKey, {
        apiVersion: '2024-06-20', // Use latest API version
    } as any);

    try {
        const { priceId, mode } = await req.json();

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: mode || 'subscription',
            success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/pricing`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
