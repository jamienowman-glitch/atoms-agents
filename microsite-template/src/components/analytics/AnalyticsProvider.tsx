"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense, useRef } from "react";

// Stub IDs - in production these would come from env vars
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-STUB_GA_ID";
const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "0000000000000000";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMounted = useRef(false);

  useEffect(() => {
    // Skip the first render as the scripts handle the initial page view
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (pathname && window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }

    if (pathname && window.fbq) {
        window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsProvider() {
  return (
    <>
      {/* Google Analytics GA4 */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* Meta Pixel */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}

// Add type definitions for window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}
