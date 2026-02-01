import { buildIdentityHeaders, RequestContext } from '@packages/transport/src/identity_headers';
import { readResponsePayload, TransportEnvelopeError } from '@packages/transport/src/envelope';

export type SpecKind = 'atom' | 'component' | 'lens';

export interface RegistrySpec {
    id: string;
    kind: SpecKind;
    version: number;
    schema: Record<string, unknown>;
    defaults: Record<string, unknown>;
    controls: Record<string, unknown>;
    token_surface: string[];
    metadata: Record<string, unknown>;
}

export interface RegistryClientOptions {
    httpHost: string;
    token: string;
    context: RequestContext;
}

export interface ListSpecsOptions {
    kind: SpecKind;
    cursor?: string;
    ifNoneMatch?: string;
    requestId?: string;
}

export interface ListSpecsResult {
    specs?: RegistrySpec[];
    next_cursor?: string | null;
    version?: number;
    etag?: string;
    notModified?: boolean;
}

export interface GetSpecOptions {
    id: string;
    ifNoneMatch?: string;
    requestId?: string;
}

export interface GetSpecResult {
    spec?: RegistrySpec;
    etag?: string;
    notModified?: boolean;
}

export class RegistryClient {
    private readonly host: string;
    private readonly token: string;
    private readonly context: RequestContext;

    constructor(options: RegistryClientOptions) {
        this.host = options.httpHost.replace(/\/+$/, '');
        this.token = options.token;
        this.context = options.context;
    }

    private nextRequestId(): string {
        return `req-${Math.random().toString(36).slice(2, 11)}`;
    }

    private composeHeaders(extras?: Record<string, string>, overrideRequestId?: string): Record<string, string> {
        return buildIdentityHeaders({
            token: this.token,
            context: this.context,
            requestId: overrideRequestId,
            extras,
        });
    }

    public async listSpecs(options: ListSpecsOptions): Promise<ListSpecsResult> {
        const url = new URL(`${this.host}/registry/specs`);
        url.searchParams.set('kind', options.kind);
        if (options.cursor) {
            url.searchParams.set('cursor', options.cursor);
        }
        const headers = this.composeHeaders(
            {
                Accept: 'application/json',
                ...(options.ifNoneMatch ? { 'If-None-Match': options.ifNoneMatch } : {}),
            },
            options.requestId ?? this.nextRequestId(),
        );

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers,
        });

        if (response.status === 304) {
            return {
                notModified: true,
                etag: response.headers.get('etag') ?? undefined,
            };
        }

        const payload = await readResponsePayload(response);
        if (!response.ok) {
            throw new TransportEnvelopeError(response.status, payload.envelope, payload.json ?? payload.text);
        }

        const body = payload.json;
        if (!body || typeof body !== 'object') {
            throw new Error('Registry specs response missing body');
        }

        const result = body as {
            specs: RegistrySpec[];
            next_cursor?: string | null;
            etag?: string;
            version?: number;
        };

        return {
            specs: result.specs ?? [],
            next_cursor: result.next_cursor ?? null,
            version: result.version,
            etag: result.etag ?? response.headers.get('etag') ?? undefined,
        };
    }

    public async getSpec(options: GetSpecOptions): Promise<GetSpecResult> {
        const url = `${this.host}/registry/specs/${encodeURIComponent(options.id)}`;
        const headers = this.composeHeaders(
            {
                Accept: 'application/json',
                ...(options.ifNoneMatch ? { 'If-None-Match': options.ifNoneMatch } : {}),
            },
            options.requestId ?? this.nextRequestId(),
        );

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (response.status === 304) {
            return {
                notModified: true,
                etag: response.headers.get('etag') ?? undefined,
            };
        }

        const payload = await readResponsePayload(response);
        if (!response.ok) {
            throw new TransportEnvelopeError(response.status, payload.envelope, payload.json ?? payload.text);
        }

        const body = payload.json;
        if (!body || typeof body !== 'object') {
            throw new Error('Registry spec detail missing body');
        }

        return {
            spec: body as RegistrySpec,
            etag: response.headers.get('etag') ?? undefined,
        };
    }
}
