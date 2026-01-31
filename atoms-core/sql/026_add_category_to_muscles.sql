-- 026_add_category_to_muscles.sql
-- Fixes sync_muscles.py failure by adding missing column

ALTER TABLE public.muscles 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'uncategorized';

-- Optional: Update existing rows based on key pattern if needed
-- UPDATE public.muscles SET category = split_part(key, '.', 1) WHERE category = 'uncategorized';
