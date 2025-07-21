import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
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
    // body এর মধ্যে অবশ্যই imageUrl থাকবে যদি ফর্ম থেকে পাঠানো হয়

    const employee = await prisma.employees.create({
      data: {
        name: body.name,
        mobile: body.mobile || null,
        email: body.email || null,
        designation: body.designation,
        order: body.order ? Number(body.order) : null,
        notes: body.notes || null,
        imageUrl: body.imageUrl || null, // ✅ imgbb থেকে আসা URL
      },
    });

    return new Response(JSON.stringify({ success: true, employee }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
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

    await prisma.employees.delete({ where: { id } });

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
