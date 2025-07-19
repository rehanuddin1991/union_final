import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
import { NextResponse } from "next/server";
//import { signToken } from "@/utils/auth";

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

 

export async function POST(req) {
  try {
    const { email, password } = await req.json();
   
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = signToken({ id: user.id, role: user.role });

   // return NextResponse.json({ token, role: user.role }, { status: 200 });

    const res = NextResponse.json({ role: user.role }, { status: 200 });

  // ✅ HttpOnly Cookie সেট করো
  res.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 দিন
  });

  return res;

  } catch (err) {
      console.error("Login Error:", err.message, err.stack);

    return NextResponse.json({ message: "111Internal server error" }, { status: 500 });
  }
}

