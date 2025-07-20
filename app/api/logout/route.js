import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ success: true, message: 'Logged out' });

  res.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  return res;
}
