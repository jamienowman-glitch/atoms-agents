import React, { useEffect } from 'react';
import { ToolHarness } from '../../harness/ToolHarness';
import { TransportProvider, useCanvasTransport } from '../../harness/transport/provider';
import { TransportConfig } from '../../harness/transport';
import { DraftHarnessStage } from './blocks/DraftHarnessStage';

const DEFAULT_TRANSPORT_CONFIG: TransportConfig = {
    httpHost: 'http://localhost:8000',
    wsHost: 'ws://localhost:8000',
    token: 'mock_token',
    threadId: 'draft-harness',
    context: {
        tenant_id: 't_system',
        mode: 'saas',
        project_id: 'p_default',
        request_id: 'req_draft_harness',
        surface_id: 'draft_harness',
        user_id: 'u_me'
    }
};

function DraftHarnessInner({ canvasId }: { canvasId: string }) {
    const transport = useCanvasTransport();

    useEffect(() => {
        if (!transport) return;
        transport.connect(canvasId);
        return () => transport.disconnect();
    }, [transport, canvasId]);

    return (
        <ToolHarness
            scope={{ surfaceId: 'draft_harness', scope: 'global' }}
            transportCanvasId={canvasId}
            toolPopAttachment="chatrail"
        >
            <DraftHarnessStage />
        </ToolHarness>
    );
}

export function DraftHarnessCanvas({
    transportConfig = DEFAULT_TRANSPORT_CONFIG,
    canvasId = 'draft-harness'
}: {
    transportConfig?: TransportConfig;
    canvasId?: string;
}) {
    return (
        <TransportProvider config={transportConfig}>
            <DraftHarnessInner canvasId={canvasId} />
        </TransportProvider>
    );
}
