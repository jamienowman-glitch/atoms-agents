"use client";

import React, { useEffect, useState } from 'react';

export function HiddenAttributionFields() {
    const [values, setValues] = useState({
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        gclid: '',
        referrer: ''
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        setValues({
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            gclid: params.get('gclid') || '',
            referrer: document.referrer || ''
        });
    }, []);

    return (
        <>
            <input type="hidden" name="utm_source" value={values.utm_source} />
            <input type="hidden" name="utm_medium" value={values.utm_medium} />
            <input type="hidden" name="utm_campaign" value={values.utm_campaign} />
            <input type="hidden" name="gclid" value={values.gclid} />
            <input type="hidden" name="referrer" value={values.referrer} />
        </>
    );
}
