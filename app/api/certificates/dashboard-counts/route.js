import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1️⃣ Typewise Certificate Count (is_deleted: false)
    const typewiseCertificates = await prisma.certificate.groupBy({
      by: ["type"],
      _count: { id: true },
      where: { is_deleted: false },
    });

    const formattedTypewise = typewiseCertificates.map(item => ({
      type: item.type,
      count: item._count.id,
    }));

    // 2️⃣ Open Page Certificate Count
    const openPageCount = await prisma.certificate.count({
      where: {
        is_deleted: true,
        entry_page: "open",
        is_approved: false,
      },
    });

    // 3️⃣ Holding Count (is_deleted: false)
    const holdingCount = await prisma.holding_Information.count({
      where: { is_deleted: false },
    });

    return NextResponse.json({
      success: true,
      certificatesTypewise: formattedTypewise,
      openPageCount,
      holdingCount,
    });
  } catch (error) {
    console.error("Error in dashboard counts:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
