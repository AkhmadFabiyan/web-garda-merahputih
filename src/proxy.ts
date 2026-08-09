import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed domains for API access
const ALLOWED_DOMAINS = [
  'localhost:3000',
  '127.0.0.1:3000',
  'garda.unesa.ac.id',
  'pkkmb.unesa.ac.id',
];

export function proxy(request: NextRequest) {
  // Only protect the AI API route
  if (request.nextUrl.pathname.startsWith('/api/garda')) {
    // 1. Method Validation
    if (request.method !== 'POST') {
      return new NextResponse(
        JSON.stringify({ error: 'Method Not Allowed', message: 'Only POST requests are accepted.' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Payload Size Limit (Max 10KB) to prevent slowloris/abuse
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 10240) {
      return new NextResponse(
        JSON.stringify({ error: 'Payload Too Large', message: 'Request body exceeds size limit.' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Origin/Referer Validation
    const referer = request.headers.get('referer');
    const origin = request.headers.get('origin');
    
    const source = referer || origin;

    // Block direct API calls (e.g. from cURL or Postman without spoofing)
    if (!source) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Forbidden', 
          message: 'Direct API access is not allowed.' 
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if source matches allowed domains
    const isAllowed = ALLOWED_DOMAINS.some(domain => source.includes(domain));

    if (!isAllowed) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Forbidden', 
          message: 'Origin not recognized.' 
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/garda/:path*',
};
