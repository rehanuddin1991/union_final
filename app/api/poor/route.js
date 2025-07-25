 import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


// GET: সব poor ডেটা রিটার্ন করবে
export async function GET() {
  try {
    const poorList = await prisma.poor.findMany({
      where: { is_deleted: false },
      orderBy: { id: "desc" },
    });
    return new Response(JSON.stringify({ success: true, data: poorList }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// POST: নতুন poor ডেটা তৈরি করবে
export async function POST(req) {
  try {
    const body = await req.json();
    const newPoor = await prisma.poor.create({
      data: {
        name: body.name,
        father: body.father || null,
        mother: body.mother || null,
        nid: body.nid || null,
        mobile: body.mobile || null,
        ward: body.ward || null,
        address: body.address || null,
        comments: body.comments || null,
      },
    });
    return new Response(JSON.stringify({ success: true, data: newPoor }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// PATCH: আপডেট করার জন্য (id সহ)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const updatedPoor = await prisma.poor.update({
      where: { id: body.id },
      data: {
        name: body.name,
        father: body.father || null,
        mother: body.mother || null,
        nid: body.nid || null,
        mobile: body.mobile || null,
        ward: body.ward || null,
        address: body.address || null,
        comments: body.comments || null,
      },
    });
    return new Response(
      JSON.stringify({ success: true, data: updatedPoor }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// DELETE: soft delete (is_deleted = true)
export async function DELETE(req) {
  try {
    const body = await req.json();
    await prisma.poor.update({
      where: { id: body.id },
      data: { is_deleted: true },
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
