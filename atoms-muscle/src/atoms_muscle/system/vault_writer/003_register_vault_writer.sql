-- Manually register the system tool
INSERT INTO public.tools (name, description, category, config)
VALUES (
  'write_secret',
  'Securely writes secrets to the Northstar Vault (disk).',
  'system',
  '{"mcp_endpoint": "http://localhost:8000/system/vault_writer"}' -- Assuming standard Muscle deployment
) ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  config = EXCLUDED.config;
