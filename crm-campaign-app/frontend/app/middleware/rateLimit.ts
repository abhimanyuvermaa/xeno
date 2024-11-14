import rateLimit from 'express-rate-limit';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

export function middleware(request: NextRequest) {
  // Apply rate limiting to API routes only
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return limiter(request, NextResponse);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};