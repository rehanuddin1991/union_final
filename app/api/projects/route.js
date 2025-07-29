import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

 

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { is_deleted: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  const body = await req.json();
  const { title, description, status, comments } = body;

  if (!title) {
    return NextResponse.json({ success: false, message: "নাম আবশ্যক" }, { status: 400 });
  }

  const newProject = await prisma.project.create({
    data: { title, description, status, comments },
  });

  return NextResponse.json({ success: true, project: newProject });
}

export async function PATCH(req) {
  try {
    const id = Number(new URL(req.url).searchParams.get("id")); // ⚠️ String থেকে Number এ রূপান্তর
    if (!id) {
      return NextResponse.json({ success: false, message: "Invalid or missing ID" }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, status, comments } = body;

    const updated = await prisma.project.update({
      where: { id }, // এখন id ঠিক টাইপের
      data: { title, description, status, comments },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("PATCH /api/projects error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ success: false, message: "Invalid or missing ID" }, { status: 400 });
    }

    await prisma.project.update({
      where: { id },
      data: { is_deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

