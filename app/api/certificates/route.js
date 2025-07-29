import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextResponse } from 'next/server'
//import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const certificate = await prisma.certificate.findFirst({
        where: { 
          id: parseInt(id),
          is_deleted: false , // এখানে সরাসরি শর্ত দেয়া হলো
        },
      });

      if (!certificate) {
        return NextResponse.json(
          { success: false, message: "সনদ পাওয়া যায়নি" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, certificates: [certificate] });
    }

    // যদি id না থাকে, সব active সনদ ফেরত দাও
    const certificates = await prisma.certificate.findMany({
      where: { is_deleted: false  },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function convertToBengaliNumber(number) {
  const bengaliDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return number.toString().split('').map(digit => bengaliDigits[parseInt(digit)]).join('');
}

 export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Required field check
    const requiredFields = ["applicantName", "fatherName", "motherName", "birthDate", "type"];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return Response.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if ("id" in body) delete body.id;

    body.birthDate = new Date(body.birthDate);
    if (body.issuedDate) body.issuedDate = new Date(body.issuedDate);
    if (body.businessStartDate) body.businessStartDate = new Date(body.businessStartDate);

    // ✅ Type wise total count বের করুন
    const existingCount = await prisma.certificate.count({
      where: { type: body.type,is_deleted: false },
    });

    if (existingCount === 0) {
      // ✅ যদি type wise কোনো ডাটা না থাকে → form এর letter_count নিন
      body.letter_count = parseInt(body.letter_count) || 1;
    } else {
      // ✅ যদি ডাটা থাকে → max + 1 নিন
      const maxLetterCount = await prisma.certificate.aggregate({
        _max: { letter_count: true },
        where: { type: body.type,is_deleted: false },
      });

      body.letter_count = (maxLetterCount._max.letter_count || 0) + 1;
    }

    // ✅ ডাটা Insert
    const certificate = await prisma.certificate.create({
      data: { ...body },
    });

    // ✅ Convert ID to Bengali number and concat
    const bengaliId = convertToBengaliNumber(certificate.id);
    const autoGenNum = "২৫৪৬১৮০৫৭০১০০০০" + bengaliId;

    // ✅ Update with Bengali autoGenNum
    const updatedCertificate = await prisma.certificate.update({
      where: { id: certificate.id },
      data: { autoGenNum },
    });

    return Response.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    console.error("Certificate Insert Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function PATCH(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    if (!id) return Response.json({ success: false, error: 'ID missing' }, { status: 400 })

    const body = await req.json()

    if ('id' in body) delete body.id

    if (body.birthDate) body.birthDate = new Date(body.birthDate)
    if (body.issuedDate) body.issuedDate = new Date(body.issuedDate)
    if (body.businessStartDate) body.businessStartDate = new Date(body.businessStartDate)

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        ...body,
      },
    })

    return Response.json({ success: true, certificate })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}


export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));
    if (!id)
      return Response.json(
        { success: false, error: "ID missing" },
        { status: 400 }
      );

    // Soft delete (update is_deleted = true)
    await prisma.certificate.update({
      where: { id },
      data: { is_deleted: true },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
