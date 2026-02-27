-- Phase 1: Tenant-Strict PII Engine
-- Target: public.registry_components
-- Repos: atoms-agents

INSERT INTO public.registry_components (alias, repo, file_path, type, description, status)
VALUES
    ('privacy_runtime_init', 'agents', 'src/atoms_agents/runtime/privacy/__init__.py', 'muscle', 'Runtime Privacy Module Entrypoint', 'active'),
    ('privacy_scrubber', 'agents', 'src/atoms_agents/runtime/privacy/scrubber.py', 'muscle', 'Recursive PII Scrubber', 'active'),
    ('privacy_policy', 'agents', 'src/atoms_agents/runtime/privacy/policy.py', 'muscle', 'Fail-Closed Privacy Policy', 'active'),
    ('privacy_detectors', 'agents', 'src/atoms_agents/runtime/privacy/detectors.py', 'muscle', 'PII Regex Detectors', 'active'),
    ('privacy_models', 'agents', 'src/atoms_agents/runtime/privacy/models.py', 'muscle', 'Privacy Data Contracts', 'active'),
    ('privacy_tokenizer', 'agents', 'src/atoms_agents/runtime/privacy/tokenizer.py', 'muscle', 'Deterministic PII Tokenizer', 'active')
ON CONFLICT (alias) DO UPDATE SET
    repo = EXCLUDED.repo,
    file_path = EXCLUDED.file_path,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Verification Select
SELECT alias, repo, file_path, status 
FROM public.registry_components 
WHERE alias LIKE 'privacy_%';
