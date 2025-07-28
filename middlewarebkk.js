import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Simple in-memory rate limiter (Not suitable for distributed servers)
const ipRequestMap = new Map();

function rateLimiter(ip, limit = 100, interval = 60 * 1000) {
  const currentTime = Date.now();

  if (!ipRequestMap.has(ip)) {
    ipRequestMap.set(ip, []);
  }

  const requestTimes = ipRequestMap
    .get(ip)
    .filter((time) => currentTime - time < interval);

  requestTimes.push(currentTime);
  ipRequestMap.set(ip, requestTimes);

  return requestTimes.length <= limit;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";

  console.log('Middleware Triggered');
  console.log('PATHNAME:', pathname);
  console.log('Client IP:', ip);

  // Rate Limiting
  if (!rateLimiter(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return new NextResponse("Too many requests", { status: 429 });
  }

  // Public paths like login page don’t require auth
  if (pathname === "/secure-login") {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.log('No token found. Redirecting to /secure-login');
    return NextResponse.redirect(new URL('/secure-login', req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    console.log('Decoded Token:', payload);

    if (pathname.startsWith('/dsh_board/admin') && payload.role !== 'ADMIN') {
      console.log('Unauthorized role for admin path. Redirecting to /secure-login');
      return NextResponse.redirect(new URL('/secure-login', req.url));
    }

    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');

    console.log('Access granted. Continuing request.');
    return res;
  } catch (error) {
    console.log('JWT verification failed:', error.message);
    return NextResponse.redirect(new URL('/secure-login', req.url));
  }
}

export const config = {
  matcher: [
    '/dsh_board/admin/:path*',
    '/dsh_board/user/:path*',
    '/api/:path*' // Optional: Rate-limit APIs too
  ],
};
