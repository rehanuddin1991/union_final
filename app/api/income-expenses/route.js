import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const records = await prisma.incomeExpense.findMany({
      where: { is_deleted: false },
      orderBy: { date: "desc" },
    });
    return new Response(JSON.stringify({ success: true, records }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const token = req.cookies.get("token")?.value;
    if (!token) return new Response(JSON.stringify({ success: false, error: "Missing token" }), { status: 401 });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

    const record = await prisma.incomeExpense.create({
      data: {
        type: body.type,
        title: body.title,
        amount: parseFloat(body.amount),
        date: new Date(body.date),
        notes: body.notes || null,
        insertedBy: userId,
      },
    });

    return new Response(JSON.stringify({ success: true, record }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));
    const body = await req.json();

    const token = req.cookies.get("token")?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

    const updated = await prisma.incomeExpense.update({
      where: { id },
      data: {
        type: body.type,
        title: body.title,
        amount: parseFloat(body.amount),
        date: new Date(body.date),
        notes: body.notes || null,
        updatedBy: userId,
      },
    });

    return new Response(JSON.stringify({ success: true, updated }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));

    const token = req.cookies.get("token")?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

    await prisma.incomeExpense.update({
      where: { id },
      data: { is_deleted: true, deletedBy: userId },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
