 import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { jwtVerify } from 'jose';


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
    const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

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
        insertedBy:userId ,
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
    const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);
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
        updatedBy:userId,
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
    const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);
    await prisma.poor.update({
      where: { id: body.id },
      data: { is_deleted: true,deletedBy:userId },
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
