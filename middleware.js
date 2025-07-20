import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  console.log('Middleware Triggered');
  console.log('PATHNAME:', pathname);
  console.log('TOKEN FROM COOKIE:', token);

  if (!token) {
    console.log('No token found. Redirecting to /secure-login');
    return NextResponse.redirect(new URL('/secure-login', req.url));
  }

  try {
    // JWT verify with jose
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

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
  ],
  // runtime: 'edge' // edge runtime এ রান হবে, default
};
