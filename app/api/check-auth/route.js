// /app/api/check-auth/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ auth: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ auth: true, role: decoded.role });
  } catch (error) {
    return NextResponse.json({ auth: false }, { status: 401 });
  }
}
