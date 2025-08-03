import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

// 👉 CREATE MasterRole
export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized: missing token" },
        { status: 401 }
      );

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userId = parseInt(payload.id);

    const data = await req.json();

    const newRole = await prisma.masterRole.create({
      data: {
        ...data,
        insertedBy: userId, // ✅ InsertedBy যোগ
      },
    });

    return NextResponse.json({ success: true, data: newRole });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { success: false, message: "Create failed" },
      { status: 500 }
    );
  }
}

// 👉 READ MasterRoles (excluding deleted)
export async function GET() {
  try {
    const roles = await prisma.masterRole.findMany({
      where: {
        is_deleted: false,
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ success: true, data: roles });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Fetch failed" },
      { status: 500 }
    );
  }
}

// 👉 UPDATE MasterRole
export async function PATCH(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized: missing token" },
        { status: 401 }
      );

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userId = parseInt(payload.id);

    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const updatedRole = await prisma.masterRole.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updatedBy: userId, // ✅ updatedBy যোগ
      },
    });

    return NextResponse.json({ success: true, data: updatedRole });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

// 👉 SOFT DELETE MasterRole
export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized: missing token" },
        { status: 401 }
      );

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userId = parseInt(payload.id);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    await prisma.masterRole.update({
      where: { id: parseInt(id) },
      data: {
        is_deleted: true, // ✅ soft delete
        deletedBy: userId, // ✅ deletedBy যোগ
         
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
