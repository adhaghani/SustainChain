/**
 * Next.js Middleware
 * 
 * Runs on Edge before requests are processed.
 * - Rate limiting headers for expensive operations (Bill Analysis, Report Generation)
 * - Request logging and monitoring
 * 
 * Note: 
 * - Authentication for pages is handled client-side by the protected layout
 * - Authentication for API routes is handled by each route's token verification
 * - Edge Runtime has limitations - complex Firestore operations should be done in API routes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware Configuration
 * Define which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

/**
 * Rate-limited API endpoints
 * These will have rate limit headers added, but actual rate limiting is done in API routes
 * (Edge Runtime doesn't support Firebase Admin SDK)
 */
const rateLimitedEndpoints = [
  '/api/analyze',
  '/api/reports',
];

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is rate-limited
  const isRateLimitedRoute = rateLimitedEndpoints.some(route => pathname.startsWith(route));

  // For rate-limited API endpoints, add headers to enable rate limiting in API routes
  if (isRateLimitedRoute) {
    const response = NextResponse.next();
    
    // Add a header to signal that rate limiting should be checked
    response.headers.set('X-Rate-Limit-Check', 'true');
    
    // Add request ID for tracking
    const requestId = crypto.randomUUID();
    response.headers.set('X-Request-ID', requestId);
    
    return response;
  }

  // Let all other routes pass through
  // Authentication for pages is handled client-side by the protected layout
  // Authentication for API routes is handled by each route's token verification
  return NextResponse.next();
}
