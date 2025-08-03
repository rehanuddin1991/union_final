import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { jwtVerify } from 'jose';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    // যদি ID দেওয়া থাকে, তাহলে নির্দিষ্ট রেকর্ড রিটার্ন করো
    if (id) {
      const record = await prisma.inheritance.findUnique({
        where: { id: Number(id) },
        include: { children: true },
      });

      if (!record) {
        return new Response(
          JSON.stringify({ success: false, error: "রেকর্ড পাওয়া যায়নি" }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, record }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // যদি ID না থাকে, তাহলে সব রেকর্ড রিটার্ন করো
    const records = await prisma.inheritance.findMany({
      include: { children: true },
      where:{is_deleted:false},
      orderBy: { id: "desc" },
    });

    

    return new Response(
      JSON.stringify({ success: true, records }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


/**
 * ✅ নতুন ওয়ারিশ সনদ যোগ করে
 */
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      fatherName,
      motherName,
      nidOrBirth,
      permanentAddress,
      presentAddress,
      applicantName,
      applicantAddress,
      issuedDate,
      children = [],
    } = body;

    const issuedDateIso = new Date(issuedDate).toISOString();
    const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);


    // ✅ নতুন ভ্যারিয়েবল: let letterCount
    let letterCount;

    const existingCount = await prisma.inheritance.count({
      where: { is_deleted: false },
    });

    if (existingCount === 0) {
      letterCount = parseInt(body.letter_count) || 1;
    } else {
  const maxLetterCount = await prisma.inheritance.aggregate({
    _max: { letter_count: true },
    where: { is_deleted: false },
  });

  const maxCount = parseInt(maxLetterCount._max.letter_count || "0");
  letterCount = (maxCount + 1).toString();
}

    const record = await prisma.inheritance.create({
      data: {
        name,
        fatherName,
        motherName,
        nidOrBirth,
        permanentAddress,
        presentAddress,
        applicantName,
        applicantAddress,
            letter_count: letterCount.toString(), // ✅ fixed here
            insertedBy:userId,

        issuedDate: issuedDateIso,
        children: {
          create: children,
        },
      },
      include: { children: true },
    });

    return new Response(JSON.stringify({ success: true, record }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


/**
 * ✅ নির্দিষ্ট সনদ আপডেট করে
 */
export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");

    if (!idParam) {
      return new Response(
        JSON.stringify({ success: false, error: "ID পাওয়া যায়নি" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ success: false, error: "ID সঠিক নয়" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const {
      name,
      fatherName,
      motherName,
      nidOrBirth,
      permanentAddress,
      presentAddress,
      applicantName,
      applicantAddress,
      issuedDate,
      children = [],
    } = body;

    const issuedDateIso = new Date(issuedDate).toISOString(); // ✅ Ensure ISO DateTime
    const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

    await prisma.childRelation.deleteMany({ where: { inheritanceId: id } });

    const record = await prisma.inheritance.update({
      where: { id },
      data: {
        name,
        fatherName,
        motherName,
        nidOrBirth,
        permanentAddress,
        presentAddress,
        applicantName,
        applicantAddress,
        issuedDate: issuedDateIso, // ✅ Fixed here
        updatedBy: userId, // ✅ Fixed here
        children: {
          create: children,
        },
      },
      include: { children: true },
    });

    return new Response(JSON.stringify({ success: true, record }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


/**
 * ✅ নির্দিষ্ট ওয়ারিশ সনদ মুছে ফেলে
 */
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    if (!idParam) {
      return new Response(
        JSON.stringify({ success: false, error: "ID দেয়া হয়নি" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // যদি id Prisma model এ int হয়, তাহলে parseInt করো
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ success: false, error: "ID সঠিক নয়" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // childRelation ডিলিট (multiple child delete)
    await prisma.childRelation.deleteMany({ where: { inheritanceId: id } });

    // inheritance ডিলিট
    await prisma.inheritance.delete({ where: { id } });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

