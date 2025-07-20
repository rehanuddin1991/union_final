import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET;

// ✅ JWT Token sign ফাংশন
function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = signToken({ id: user.id, role: user.role });

    console.log("✅ Generated Token:", token);
    console.log("✅ User Role:", user.role);

    const res = NextResponse.json(
      { success: true, role: user.role },
      { status: 200 }
    );

    // ✅ HttpOnly Cookie সেট করুন
    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ✅ production এ true
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 দিন
    });

    return res;
  } catch (err) {
    console.error("Login Error:", err.message, err.stack);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
