import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // ✅ পুরানো token (HttpOnly Cookie) মুছে ফেলা
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // সাথে সাথে Expire হবে
  });

  return response;
}
