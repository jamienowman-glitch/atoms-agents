import React, { createContext, useContext, useEffect, useState } from 'react';
import { CanvasTransport, TransportConfig } from '@logic/transport/index';

const TransportContext = createContext<CanvasTransport | null>(null);

export const TransportProvider = ({
    config,
    children
}: {
    config: TransportConfig;
    children: React.ReactNode
}) => {
    const [transport, setTransport] = useState<CanvasTransport | null>(null);

    useEffect(() => {
        const t = new CanvasTransport(config);
        setTransport(t);

        // Connect default canvas? Or let consumer connect?
        // t.connect('default'); 

        return () => {
            t.disconnect();
        };
    }, [config]);

    return (
        <TransportContext.Provider value={transport}>
            {children}
        </TransportContext.Provider>
    );
};

export const useCanvasTransport = () => {
    const ctx = useContext(TransportContext);
    // Return null if not ready, or throw? The consumer handles null usually.
    return ctx;
};
