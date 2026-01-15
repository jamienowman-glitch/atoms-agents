# One-Page Summary

**Current Alignment with Engines**
- Identity headers exist and include Authorization + X-Tenant-Id/X-Mode/X-Project-Id (`packages/transport/src/identity_headers.ts`).
- CanvasTransport handles SSE/WS streaming and caches Last-Event-ID; safety decision events captured and surfaced in builder UI.
- CanvasKernel supports optimistic/committed state with recovery_ops hook; builder rebase path exists.
- RegistryService fetch path (`/registry/components`) already plumbed with identity headers; local schemas exist for fallback.
- Analytics client emits events with request_id/session_id/utm sanitization using identity headers.

**Top 10 Blockers to Super Canvas**
- No canonical envelope parsing or 503/410 handling (commands, snapshot, registry); gates not surfaced consistently.
- SSE replay lacks 410 resnapshot/replay gap; WS handshake unauthenticated; cursor recovery relies on localStorage.
- Identity lax: allows `t_system`, synthesizes user_id/actor_id, no tenant/project enforcement for SaaS/Enterprise.
- Config store integration missing (tool_canvas_mode and other toggles); runtime defaults hardcoded.
- Registry not contract-driven; AtomSpec/token schemas absent; inspector edits raw props, not token surfaces.
- Freeform layout tokens (position/transform/z-index/constraints) missing across UI + atoms.
- Tracking/UTM tokens absent in atoms and not consumed by analytics beyond pageview/cta.
- Accessibility and NA enforcement missing; atoms render with ad-hoc props.
- Email/DM paradigms unsupported (no email-safe/table renderers, no DM channel constraints/actions).
- Safety blocks do not rollback optimistic ops; gate-specific UX incomplete.

**Atoms Factory: First 20 Atom Types to Produce**
1. Text (headline/body/caption variants)  
2. Button/CTA (web + email-safe)  
3. Image (with focal/crop/mask)  
4. Link-only text (inline link)  
5. Section/Frame container  
6. Columns/Grid (responsive)  
7. Hero banner section  
8. Card (generic content card)  
9. List/Repeater item  
10. Form input (text/email)  
11. Form section (label + input + helper)  
12. Chat message (text)  
13. Chat quick replies row  
14. Chat CTA button (DM action)  
15. Video block  
16. Carousel/slider  
17. Image-with-text block  
18. Divider/Spacer  
19. Badge/Tag  
20. Analytics beacon/instrumentation placeholder (tracks impressions/clicks)

**Build First: Block Builder vs Freeform Primitives**
- **Block builder (Shopify/Klaviyo/ManyChat)**: flow layout section, columns/grid, text, button/CTA, image, image-with-text, form input + submit, list/repeater, card, chat message/quick replies; include tracking/accessibility/data_binding/constraints per contract.
- **Freeform builder (Figma-style)**: frame/container with absolute positioning, group, text, image, rectangle/shape, button, badge/tag; snap grid/guides, z-index/transform tokens, lock/visibility flags, TokenSurface hints for positioning/resizing.
