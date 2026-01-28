import React, { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export const WeatherLayer = () => {
    const [init, setInit] = useState(false);

    // Initialize particles engine once
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(() => ({
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: { enable: false, mode: "push" },
            },
        },
        particles: {
            color: { value: "#ffffff" },
            move: {
                direction: "bottom",
                enable: true,
                outModes: { default: "out" },
                random: false,
                speed: 2,
                straight: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 40 // Rain density
            },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
        fullScreen: { enable: false, zIndex: 0 } // Contained, not fullscreen
    }), []);

    if (!init) return null;

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            <Particles
                id="tsparticles"
                options={options as any}
                className="weather-particles"
            />
        </div>
    );
};
