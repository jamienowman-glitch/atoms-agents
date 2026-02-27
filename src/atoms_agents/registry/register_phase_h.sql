-- Phase H: Factory Loop Memory & ToolSlots
-- Target: public.registry_components
-- Repos: atoms-agents, atoms-core

INSERT INTO public.registry_components (alias, repo, file_path, type, description, status)
VALUES
    ('loop_controller', 'agents', 'src/atoms_agents/runtime/loop_controller.py', 'config', 'Factory Loop V1 State Controller', 'active'),
    ('memory_routes', 'core', 'src/atoms_core/memory/routes.py', 'config', 'Memory Service V1 Endpoints', 'active'),
    ('memory_service', 'core', 'src/atoms_core/memory/service.py', 'config', 'Memory Service V1 Implementation', 'active'),
    ('ff_tool_profiles_page', 'app', 'src/app/config/tool-slot-profiles/page.tsx', 'page', 'Tool Slot Profiles List', 'active'),
    ('ff_tool_profiles_detail', 'app', 'src/app/config/tool-slot-profiles/[key]/page.tsx', 'page', 'Tool Slot Profiles Detail', 'active'),
    ('ff_tool_profiles_api', 'app', 'src/app/api/config/tool-slot-profiles/route.ts', 'config', 'Tool Slot Profiles API', 'active')
ON CONFLICT (alias) DO UPDATE SET
    repo = EXCLUDED.repo,
    file_path = EXCLUDED.file_path,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Verification Select
SELECT alias, repo, file_path, type, status 
FROM public.registry_components 
WHERE alias IN ('loop_controller', 'memory_routes', 'memory_service');
