import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Parse Geo headers (Vercel)
  const country = request.headers.get('x-vercel-ip-country');
  const city = request.headers.get('x-vercel-ip-city');

  // Prepare request headers to pass to the backend/server components
  const requestHeaders = new Headers(request.headers);

  if (country) {
      requestHeaders.set('x-geo-country', country);
  }
  if (city) {
      requestHeaders.set('x-geo-city', city);
  }

  // Pass the modified request headers to the next step
  const response = NextResponse.next({
      request: {
          headers: requestHeaders,
      },
  });

  // Also set headers on the response so the client can read them if needed
  if (country) {
      response.headers.set('x-geo-country', country);
  }
  if (city) {
      response.headers.set('x-geo-city', city);
  }

  // Stub logic for x-user-segment
  const segment = 'default';

  if (!request.cookies.has('x-user-segment')) {
      response.cookies.set('x-user-segment', segment);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
