"use client";

import { useEffect } from 'react';

const STORAGE_KEY = 'atoms_utm_context';

export function useUtmCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    let hasUtm = false;

    params.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
        hasUtm = true;
      }
    });

    if (hasUtm) {
      try {
        const existing = localStorage.getItem(STORAGE_KEY);
        let context = {};
        if (existing) {
          try {
            context = JSON.parse(existing);
          } catch (e) {
            console.error('Failed to parse existing UTM context', e);
          }
        }

        const newContext = { ...context, ...utmParams };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newContext));
      } catch (e) {
        console.error('Failed to save UTM context', e);
      }
    }
  }, []);
}
