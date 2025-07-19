import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextResponse } from 'next/server'
//import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const certificate = await prisma.certificate.findUnique({
        where: { id: parseInt(id) },
      })

      if (!certificate) {
        return NextResponse.json({ success: false, message: 'সনদ পাওয়া যায়নি' }, { status: 404 })
      }

      return NextResponse.json({ success: true, certificates: [certificate] })
    }

    // যদি id না থাকে, সব সনদ ফেরত দাও
    const certificates = await prisma.certificate.findMany({
      orderBy: { id: 'desc' },
    })
    return NextResponse.json({ success: true, certificates })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Required field check
    const requiredFields = ["applicantName", "fatherName", "motherName",   "birthDate"];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return Response.json(
          { success: false, error: `${field} is required` },
          { status: 400 } // 400 = Bad Request
        );
      }
    }

    // id থাকলে মুছে ফেলো
    if ("id" in body) delete body.id;

    // তারিখ কনভার্ট করা
    body.birthDate = new Date(body.birthDate);
    if (body.issuedDate) body.issuedDate = new Date(body.issuedDate);

    // ✅ সেভ করা
    const certificate = await prisma.certificate.create({
      data: {
        ...body,
      },
    });

    return Response.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
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
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    if (!id) return Response.json({ success: false, error: 'ID missing' }, { status: 400 })

    await prisma.certificate.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
