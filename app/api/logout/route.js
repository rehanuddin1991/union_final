// ✅ For App Router: app/api/logout/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ message: 'Logged out' });

  // ❌ পুরানো token মুছে ফেলো
  res.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return res;
}
