import React, { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

interface WeatherData {
    temperature: number;
    weatherCode: number;
    isDay: boolean;
}

export const WeatherLayer = () => {
    const [init, setInit] = useState(false);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [gradient, setGradient] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');

    // Initialize particles engine once
    useEffect(() => {
        initParticlesEngine(async (engine: any) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // Fetch geolocation and weather
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Get geolocation with fallback
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    if (!navigator.geolocation) {
                        reject(new Error('Geolocation not supported'));
                        return;
                    }
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 5000,
                        enableHighAccuracy: false
                    });
                });

                const { latitude, longitude } = position.coords;

                // Call Open-Meteo API
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`
                );

                if (!response.ok) throw new Error('Weather API failed');

                const data = await response.json();
                const weatherData: WeatherData = {
                    temperature: data.current.temperature_2m,
                    weatherCode: data.current.weather_code,
                    isDay: data.current.is_day === 1
                };

                setWeather(weatherData);

                // Compute gradient based on weather
                const newGradient = computeGradient(weatherData);
                setGradient(newGradient);

            } catch (error) {
                console.warn('[WeatherLayer] Failed to fetch weather, using fallback', error);
                // Fallback gradient (neutral)
                setGradient('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
            }
        };

        fetchWeather();
    }, []);

    const computeGradient = (data: WeatherData): string => {
        const { weatherCode, isDay } = data;

        // Day/Night base
        if (!isDay) {
            // Night gradients
            if (weatherCode >= 61 && weatherCode <= 67) {
                // Rain at night
                return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
            }
            return 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)';
        }

        // Day gradients
        if (weatherCode >= 61 && weatherCode <= 67) {
            // Rainy day
            return 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)';
        } else if (weatherCode >= 71 && weatherCode <= 77) {
            // Snowy day
            return 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)';
        } else if (weatherCode === 0 || weatherCode === 1) {
            // Clear/mostly clear
            return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }

        // Default day
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };

    const particlesOptions = useMemo(() => {
        // Only show particles for rain/snow
        const showParticles = weather && (
            (weather.weatherCode >= 61 && weather.weatherCode <= 67) || // Rain
            (weather.weatherCode >= 71 && weather.weatherCode <= 77)    // Snow
        );

        if (!showParticles) return null;

        const isSnow = weather && weather.weatherCode >= 71 && weather.weatherCode <= 77;

        return {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: { enable: false },
                },
            },
            particles: {
                color: { value: isSnow ? "#ffffff" : "#aaaaaa" },
                move: {
                    direction: isSnow ? "bottom" : "bottom-right",
                    enable: true,
                    outModes: { default: "out" },
                    random: false,
                    speed: isSnow ? 1 : 3,
                    straight: false,
                },
                number: {
                    density: { enable: true, area: 800 },
                    value: isSnow ? 50 : 40
                },
                opacity: { value: isSnow ? 0.5 : 0.3 },
                shape: { type: "circle" },
                size: { value: { min: isSnow ? 2 : 1, max: isSnow ? 4 : 3 } },
            },
            detectRetina: true,
            fullScreen: { enable: false, zIndex: 0 }
        };
    }, [weather]);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: gradient,
                pointerEvents: 'none',
                zIndex: 0,
                transition: 'background 1s ease'
            }}
        >
            {init && particlesOptions && (
                <Particles
                    id="weather-particles"
                    options={particlesOptions as any}
                    style={{ pointerEvents: 'none' }}
                />
            )}
        </div>
    );
};
