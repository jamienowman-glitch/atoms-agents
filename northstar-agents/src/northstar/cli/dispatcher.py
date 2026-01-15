
import sys
from typing import Any
from northstar.cli import commands
from northstar.cli import commands_models
from northstar.cli import commands_modes
from northstar.cli import commands_atomic
from northstar.cli import commands_nodes
from northstar.cli import commands_flows
from northstar.cli import commands_render
from northstar.cli import commands_audit
from northstar.cli import commands_capabilities
from northstar.cli import commands_node_run
from northstar.cli import commands_live
from northstar.cli import commands_workspace
from northstar.cli import commands_server
from northstar.cli.verify_live import verify_live

def dispatch_command(ctx: Any, args: Any) -> None:
    command = args.command
    
    if command == "list-profiles":
        commands.list_profiles(ctx.profiles)
    elif command == "show-profile":
        commands.show_profile(ctx.profiles, args.profile_id)
        
    elif command == "list-modes":
        commands_modes.list_modes(ctx.modes)
    elif command == "show-mode":
        commands_modes.show_mode(ctx.modes, args.mode_id)
        
    elif command == "run-mode":
        commands_modes.run_mode(
            ctx.modes, ctx.profiles, 
            args.mode_id, args.profile,
            args.input_json if hasattr(args, "input_json") else "{}"
        )

    elif command == "verify-modes":
        commands.verify_modes(
            ctx.modes, ctx.profiles, ctx.profiles.get(args.profile).profile_id if args.profile in ctx.profiles else args.profile, args.allow_regression,
            providers=ctx.providers, models=ctx.models
        )
        
    elif command == "verify-framework":
        commands.verify_framework(
            ctx.modes, ctx.profiles,
            args.framework, args.profile,
            args.allow_regression, args.allow_mutate,
            providers=ctx.providers, models=ctx.models,
            provider_id=args.provider, model_id=args.model
        )
        
    elif command == "show-ledger":
        commands.show_ledger()

    elif command == "list-capabilities":
        commands_capabilities.list_capabilities(ctx.capabilities)
    elif command == "show-capability":
        commands_capabilities.show_capability(ctx.capabilities, args.capability_id)
        
    elif command == "list-capability-bindings":
        commands_capabilities.list_capability_bindings(ctx.bindings, args.model)
        
    elif command == "list-models":
        commands_models.list_models(ctx.models)
    elif command == "show-model":
        commands_models.show_model(ctx.models, args.model_id)

    elif command == "list-personas":
        commands_atomic.list_personas(ctx.personas)
    elif command == "show-persona":
        commands_atomic.show_persona(ctx.personas, args.persona_id)

    elif command == "list-tasks":
        commands_atomic.list_tasks(ctx.tasks)
    elif command == "show-task":
        commands_atomic.show_task(ctx.tasks, args.task_id)

    elif command == "list-artifact-specs":
        commands_atomic.list_artifact_specs(ctx.artifact_specs)
    elif command == "show-artifact-spec":
        commands_atomic.show_artifact_spec(ctx.artifact_specs, args.spec_id)

    elif command == "verify-live":
        verify_live(
            args.framework, 
            mode_id=args.mode if hasattr(args, "mode") else None, 
            allow_mutate=args.allow_mutate if hasattr(args, "allow_mutate") else False,
            profile=ctx.profiles.get(args.profile),
            allow_regression=args.allow_regression
        )

    elif command == "list-nodes":
        commands_nodes.list_nodes(ctx.nodes)
    elif command == "show-node":
        commands_nodes.show_node(ctx.nodes, args.node_id)
        
    elif command == "list-flows":
        commands_flows.list_flows(ctx.flows)
    elif command == "show-flow":
        commands_flows.show_flow(ctx.flows, args.flow_id)
    elif command == "dry-run-flow":
        commands_flows.dry_run_flow(ctx.flows, args.flow_id, args.profile)
    elif command == "run-flow":
        commands_flows.run_flow(ctx, args.flow_id, args.profile)

    elif command == "render-flow":
        commands_render.render_flow(ctx.flows, ctx.nodes, ctx.personas, args.flow_id, args.theme, args.out)
        
    elif command == "render-run":
        commands_render.render_run(ctx.flows, ctx.nodes, ctx.personas, args.report_path, args.theme, args.out)
        
    elif command == "audit-repo":
        commands_audit.audit_repo(ctx.personas)

    elif command == "run-node":
        commands_node_run.run_node(ctx, args.node_id, args.profile, args.provider, args.model)
        
    elif command == "show-trace":
        commands_node_run.show_trace(args.trace_path)

    elif command == "certify-live":
        commands_live.certify_live(ctx, args.provider, args.model, args.profile)

    elif command == "workspace-export":
        commands_workspace.workspace_export(ctx, args.out_dir)
        
    elif command == "workspace-clear":
        commands_workspace.workspace_clear(ctx, args.yes)

    elif command == "workspace-status":
        commands_workspace.workspace_status()

    elif command == "workspace-reset":
        commands_workspace.workspace_reset(args.card_type, args.card_id)

    elif command == "serve-builder":
        commands_server.serve_builder(ctx, args.port)

    # --- Authoring Phase 22 ---
    elif command == "new-node":
        from northstar.cli import commands_author
        commands_author.new_node(args.node_id, args.name, args.kind)

    elif command == "set-node":
        from northstar.cli import commands_author
        commands_author.set_node(args.node_id, args.persona, args.task, args.provider, args.model, args.cap_list)

    elif command == "del-node":
        from northstar.cli import commands_author
        commands_author.del_node(args.target_id, args.node_ref)

    elif command == "new-flow":
        from northstar.cli import commands_author
        commands_author.new_flow(args.flow_id, args.name, args.objective, args.entry_node, args.exit_node)

    elif command == "add-edge":
        from northstar.cli import commands_author
        commands_author.add_edge(args.flow_id, args.from_node, args.to_node)

    elif command == "del-edge":
        from northstar.cli import commands_author
        commands_author.del_edge(args.flow_id, args.from_node, args.to_node)

    elif command == "add-node":
        from northstar.cli import commands_author
        commands_author.add_node_to_flow(args.flow_id, args.node_ref)

    elif command == "validate-flow":
        from northstar.cli import commands_author
        commands_author.validate_flow(ctx, args.flow_id, args.live, tenant_id=args.tenant_id, profile=args.profile_id)

    elif command == "validate-node":
        from northstar.cli import commands_author
        commands_author.validate_node(ctx, args.node_id)

    elif command == "ui-export":
        from northstar.cli import commands_author
        commands_author.ui_export(ctx, args.flow_id, args.out_path, tenant_id=args.tenant_id)

    elif command == "list-tenants":
        from northstar.cli import commands_tenancy
        commands_tenancy.list_tenants(ctx)

    elif command == "show-tenant":
        from northstar.cli import commands_tenancy
        commands_tenancy.show_tenant(ctx, args.tenant_id)

    elif command == "ui-apply":
        from northstar.cli import commands_author
        commands_author.ui_apply(ctx, args.card_type, args.card_id, args.json_path)

    elif command == "export-flow":
        from northstar.cli import commands_author
        commands_author.export_flow(ctx, args.flow_id, args.out_path)

    else:
        print("Unknown command or no command specified.")
        sys.exit(1)
