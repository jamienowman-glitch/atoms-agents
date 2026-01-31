
-- 20260131_economy_config.sql
-- Seeds the initial Economy Configuration for Snax.

-- 1. Base Exchange Rate (£1 = 10 Snax)
INSERT INTO public.system_config (key, value, description)
VALUES (
    'snax_exchange_rate_gbp', 
    '10'::jsonb, 
    'Base number of Snax purchased per 1 GBP.'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, description = EXCLUDED.description;

-- 2. MSRP / "Compare At" Rate (£1 = 5 Snax -> "Was double the price")
-- Higher price per Snax means LOWER Snax per GBP.
INSERT INTO public.system_config (key, value, description)
VALUES (
    'snax_msrp_gbp', 
    '5'::jsonb, 
    'Old/Anchor exchange rate. Used to show "Was £X" pricing. Set to same as exchange_rate to disable sale mode.'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, description = EXCLUDED.description;

-- 3. Crypto Bonus (10%)
INSERT INTO public.system_config (key, value, description)
VALUES (
    'crypto_bonus_pct', 
    '10'::jsonb, 
    'Percentage bonus Snax awarded when paying via Crypto (ETH).'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, description = EXCLUDED.description;
