import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextResponse } from 'next/server'
//import { prisma } from '@/lib/prisma'

 

export async function GET() {
  try {
    const institutions = await prisma.institution.findMany({
      where: {
        is_deleted: false,
      },
    });
    return NextResponse.json(institutions);
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
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
    const institute = await prisma.institution.create({
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

    

    const institute = await prisma.institution.update({
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
    await prisma.institution.update({
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
