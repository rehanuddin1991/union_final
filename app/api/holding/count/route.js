import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.holding_Information.count({  
      where: {
        is_deleted: false, // যদি soft delete থাকে
      },
    });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
