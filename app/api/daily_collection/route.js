import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ✅ GET: All or Single by ID
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const daily_collection = await prisma.daily_Collection.findFirst({
        where: {
          id: parseInt(id),
          is_deleted: false,

        },
      });

      if (!daily_collection) {
        return NextResponse.json(
          { success: false, message: "ডাটা পাওয়া যায়নি" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        daily_collections: [daily_collection],
      });
    }

    const daily_collections = await prisma.daily_Collection.findMany({
      where: { is_deleted: false },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, daily_collections });
  } catch (error) {
    console.error("GET Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST: Create New
export async function POST(req) {
  try {
    const body = await req.json();

    const requiredFields = ["team", "receipt"];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if ("id" in body) delete body.id;

    const daily_collection = await prisma.daily_Collection.create({
      data: {
        team: body.team,
        receipt: body.receipt,
        total_taka: body.total_taka || null,
        total_cost: body.total_cost || null,
        date: body.date ? new Date(body.date) : null,
        area: body.area || null,
        comments: body.comments || null,
        gram_police: body.gram_police || null,
      },
    });

    return NextResponse.json({ success: true, daily_collection }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ PATCH: Update
export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));
    if (!id)
      return NextResponse.json(
        { success: false, error: "ID missing" },
        { status: 400 }
      );

    const body = await req.json();
    if ("id" in body) delete body.id;

    const daily_collection = await prisma.daily_Collection.update({
      where: { id },
      data: {
        team: body.team,
        receipt: body.receipt,
        total_taka: body.total_taka || null,
        total_cost: body.total_cost || null,
        date: body.date ? new Date(body.date) : null,
        area: body.area || null,
        comments: body.comments || null,
        gram_police: body.gram_police || null,
      },
    });

    return NextResponse.json({ success: true, daily_collection });
  } catch (error) {
    console.error("PATCH Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: Soft Delete
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));
    if (!id)
      return NextResponse.json(
        { success: false, error: "ID missing" },
        { status: 400 }
      );

    await prisma.daily_Collection.update({
      where: { id },
      data: { is_deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
