import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const histories = await prisma.loginHistory.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { timestamp: "desc" }, // এটা createdAt না, তোমার মডেলে timestamp আছে তাই সেটা ইউজ করো
    });

    return NextResponse.json(histories);
  } catch (err) {
    console.error("Login history API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
