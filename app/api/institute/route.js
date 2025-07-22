import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextResponse } from 'next/server'
//import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const institute = await prisma.institute.findFirst({
        where: { 
          id: parseInt(id),
          is_deleted: false , // এখানে সরাসরি শর্ত দেয়া হলো
        },
      });

      if (!institute) {
        return NextResponse.json(
          { success: false, message: "সনদ পাওয়া যায়নি" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, institutes: [institute] });
    }

    // যদি id না থাকে, সব active সনদ ফেরত দাও
    const institutes = await prisma.institute.findMany({
      where: { is_deleted: false  },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, institutes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



 export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Required field check
    const requiredFields = ["name", "head"];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return Response.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if ("id" in body) delete body.id;

    

     

    // ✅ ডাটা Insert
    const institute = await prisma.institute.create({
      data: { ...body },
    });

    return Response.json({ success: true, institute }, { status: 201 });
  } catch (error) {
    console.error("institute Insert Error:", error.message);
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

    

    const institute = await prisma.institute.update({
      where: { id },
      data: {
        ...body,
      },
    })

    return Response.json({ success: true, institute })
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
    await prisma.institute.update({
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
