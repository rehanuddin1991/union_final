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
          entry_page: "open" , // এখানে সরাসরি শর্ত দেয়া হলো
           is_deleted:true,
           is_approved:false
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
      where: { entry_page: "open", is_deleted:true ,  is_approved:false },
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
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"));
    const body = await req.json();

    const maxLetterCount = await prisma.certificate.aggregate({
        _max: { letter_count: true },
        where: { type: body.type,is_deleted: false },
      });

      const letter_count_new = (maxLetterCount._max.letter_count || 0) + 1;
    const updated = await prisma.certificate.update({
      where: { id },
      data: {
        is_approved: body.is_approved ?? false,
        is_deleted: body.is_deleted ?? false,
        letter_count: letter_count_new ?? false,

      },
    });

    return Response.json({ success: true, updated });
  } catch (error) {
    console.error("Update Certificate Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
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
 

      body.letter_count = 0;
    

    // ✅ ডাটা Insert
    const certificate = await prisma.certificate.create({
      data: { ...body },
    });

    return Response.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    console.error("Certificate Insert Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}


 


 
