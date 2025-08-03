import { PrismaClient } from "@prisma/client";
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      where: { is_deleted: false },      // ✅ Soft deleted বাদ
      orderBy: { order: "asc" },
    });
    return new Response(JSON.stringify({ success: true, employees }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const token = req.cookies.get('token')?.value; // ✅ get JWT token
    console.log("Tokenssss:", token);

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token or userId' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const employee = await prisma.employees.create({
      data: {
        name: body.name,
        mobile: body.mobile || null,
        email: body.email || null,
        designation: body.designation,
        order: body.order ? Number(body.order) : null,
        notes: body.notes || null,
        imageUrl: body.imageUrl || null,
        insertedBy: userId, // ✅ From token
      },
    });

    return new Response(JSON.stringify({ success: true, employee }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * ✅ নির্দিষ্ট কর্মচারীর তথ্য আপডেট করে
 */
export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));
    const body = await req.json();

     const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);


    const employee = await prisma.employees.update({
      where: { id },
      data: {
        name: body.name,
        mobile: body.mobile || null,
        email: body.email || null,
        designation: body.designation,
        order: body.order ? Number(body.order) : null,
        notes: body.notes || null,
        imageUrl: body.imageUrl || null, // ✅ আপডেটের সময়ও নতুন URL সেভ হবে
        updatedBy:userId,
      },
    });

    return new Response(JSON.stringify({ success: true, employee }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

 
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));

    // 🔐 token থেকে userId বের করি
    const token = req.cookies.get("token")?.value;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userId = parseInt(payload.id);

    // 🔄 Soft delete + কে ডিলিট করলো সেটা সেভ
    await prisma.employees.update({
      where: { id },
      data: {
        is_deleted: true,
        deletedBy: userId,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

