import { RequestContext } from './identity_headers';
import { RegistryClient, SpecKind } from './registry_client.ts';
import { TransportEnvelopeError } from './envelope';

const createMockResponse = (
    payload: unknown,
    options?: { status?: number; ok?: boolean; etag?: string },
) => {
    const status = options?.status ?? 200;
    const etag = options?.etag ?? '"etag-specs"';
    return {
        ok: options?.ok ?? (status >= 200 && status < 300),
        status,
        headers: {
            get: (key: string) => {
                if (key.toLowerCase() === 'etag') {
                    return etag;
                }
                return null;
            },
        },
        json: () => Promise.resolve(payload),
        text: () => Promise.resolve(typeof payload === 'string' ? payload : JSON.stringify(payload ?? null)),
    };
};

const context: RequestContext = {
    tenant_id: 't_registry',
    mode: 'saas',
    project_id: 'proj',
    request_id: 'req-specs',
    session_id: 'sess-specs',
    app_id: 'app-specs',
    surface_id: 'surface-specs',
    user_id: 'user-specs',
    membership_role: 'member',
};

beforeEach(() => {
    global.fetch = jest.fn();
});

describe('RegistryClient', () => {
    const client = new RegistryClient({
        httpHost: 'https://registry.test',
        token: 'REGISTRY_TOKEN',
        context,
    });

    test('listSpecs success', async () => {
        const payload = {
            specs: [
                {
                    kind: 'atom',
                    id: 'builder.button',
                    version: 1,
                    schema: {},
                    defaults: {},
                    controls: {},
                    token_surface: ['/canvas/op'],
                    metadata: {},
                },
            ],
            next_cursor: 'cursor-1',
            version: 5,
            etag: '"etag-page"',
        };
        (global.fetch as jest.Mock).mockResolvedValueOnce(
            createMockResponse(payload, { status: 200 }),
        );

        const result = await client.listSpecs({ kind: 'atom' });
        expect(result.specs?.[0]?.id).toBe('builder.button');
        expect(result.next_cursor).toBe('cursor-1');
        expect(result.version).toBe(5);
        expect(result.etag).toBe('"etag-page"');

        const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
        expect(fetchArgs[0]).toContain('/registry/specs?kind=atom');
        expect(fetchArgs[1].headers['Authorization']).toBe('Bearer REGISTRY_TOKEN');
    });

    test('listSpecs not modified returns flag', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            status: 304,
            ok: false,
            headers: {
                get: () => '"etag-304"',
            },
        });

        const result = await client.listSpecs({ kind: 'atom', ifNoneMatch: '"etag-304"' });
        expect(result.notModified).toBe(true);
        expect(result.etag).toBe('"etag-304"');
        expect(result.specs).toBeUndefined();
        expect(result.next_cursor).toBeUndefined();
    });

    test('listSpecs missing route throws envelope', async () => {
        const envelope = {
            error: {
                code: 'component_registry.missing_route',
                message: 'Missing',
                http_status: 503,
            },
        };
        (global.fetch as jest.Mock).mockResolvedValueOnce(createMockResponse(envelope, { status: 503, ok: false }));

        await expect(client.listSpecs({ kind: 'atom' })).rejects.toMatchObject({
            code: 'component_registry.missing_route',
            status: 503,
        });
    });

    test('listSpecs invalid cursor throws envelope', async () => {
        const envelope = {
            error: {
                code: 'component_registry.cursor_invalid',
                message: 'Invalid cursor',
                http_status: 410,
            },
        };
        (global.fetch as jest.Mock).mockResolvedValueOnce(createMockResponse(envelope, { status: 410, ok: false }));

        await expect(client.listSpecs({ kind: 'atom', cursor: 'bad' })).rejects.toMatchObject({
            code: 'component_registry.cursor_invalid',
            status: 410,
        });
    });

    test('getSpec success', async () => {
        const spec = {
            kind: 'atom',
            id: 'builder.button',
            version: 2,
            schema: {},
            defaults: {},
            controls: {},
            token_surface: ['/canvas/op'],
            metadata: {},
        };
        (global.fetch as jest.Mock).mockResolvedValueOnce(createMockResponse(spec, { status: 200 }));

        const result = await client.getSpec({ id: 'builder.button' });
        expect(result.spec?.id).toBe('builder.button');
        expect(result.etag).toBe('"etag-specs"');
    });
});
