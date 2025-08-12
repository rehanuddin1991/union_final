import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("start");
    const endDate = url.searchParams.get("end");

    const whereCondition = {
      is_deleted: false,
    };

    if (startDate && endDate) {
      whereCondition.date = {
        gte: new Date(startDate),
        lte: new Date(endDate + "T23:59:59"),
      };
    }

    const records = await prisma.incomeExpense.findMany({
      where: whereCondition,
      orderBy: { date: "asc" },
    });

    // Calculate totals
    const totalIncome = records
      .filter(r => r.type === "INCOME")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalExpense = records
      .filter(r => r.type === "EXPENSE")
      .reduce((sum, r) => sum + r.amount, 0);

    return new Response(JSON.stringify({
      success: true,
      records,
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      }
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
