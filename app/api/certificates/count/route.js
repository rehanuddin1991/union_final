 

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // এই type frontend থেকে পাঠানো

    let whereCondition = {};

    if (type === "2") {
      // 🔁 type = 2 হলে deleted এবং entry_page = "2"
      whereCondition = {
        is_deleted: true,
        entry_page: "open",
        
        is_approved:false
      };
    } else {
      // ✅ type = 1 বা অন্য যেকোনো ক্ষেত্রে সাধারণ condition
      whereCondition = {
        is_deleted: false,
      };
    }

    const count = await prisma.certificate.count({
      where: whereCondition,
    });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

