import React, { useRef, useEffect } from 'react';
import { NodeProps } from 'reactflow';
import WaveSurfer from 'wavesurfer.js';

export const BuildingAudio = ({ data }: { data: NodeProps['data'] }) => {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        if (!waveformRef.current) return;

        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#4F4A85',
            progressColor: '#383351',
            url: data.audioUrl || '/demo-audio.mp3', // data.audioUrl should come from sidecar ref
        });

        return () => {
            wavesurfer.current?.destroy();
        };
    }, [data.audioUrl]);

    return (
        <div className="building-audio">
            <div ref={waveformRef} style={{ width: '100%', height: '80px' }} />
            <div style={{ padding: '8px', fontSize: '12px', color: '#666' }}>
                {data.status || 'Ready'}
            </div>
        </div>
    );
};
