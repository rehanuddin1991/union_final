import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const dynamic = "force-dynamic"; // ✅ Vercel এ build time এ প্রি-রেন্ডার করবে না
import { jwtVerify } from 'jose';
import { useId } from 'react';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // ✅ শুধু একক holding ফেরত দেবে
      const holding = await prisma.holding_Information.findUnique({
        where: { id: parseInt(id), is_deleted: false },
      });

      if (!holding) {
        return Response.json(
          { success: false, message: "Holding not found" },
          { status: 404 }
        );
      }

      return Response.json({ success: true, holding });
    }

    // ✅ সব holding ফেরত দেবে
    const holdings = await prisma.holding_Information.findMany({
      where: { is_deleted: false },
      orderBy: { id: "desc" },
    });

    return Response.json({ success: true, holdings });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST new holding
export async function POST(req) {
  try {
    const body = await req.json()
    const dobDate = body.dob ? new Date(body.dob) : null

     const existing = await prisma.holding_Information.findUnique({
  where: { nid: body.nid, is_deleted:false },
});

if (existing) {
  return Response.json({ success: false, error: " এনআইডি নম্বরটি ইতোমধ্যে সংরক্ষণ করা হয়েছে" });
}


    // ✅ ডুপ্লিকেট চেক (Ward + Holding No)
    const existingByWardHolding = await prisma.holding_Information.findFirst({
      where: {
        ward: body.ward,
        holdingNo: body.holdingNo,
        is_deleted: false,
      },
    });

    if (existingByWardHolding) {
      return Response.json(
        { success: false, error: `${body.ward}  ওয়ার্ডের  ${body.holdingNo}  হোল্ডিং নং আগে থেকেই সংরক্ষিত আছে।` },
        { status: 400 }
      );
    }


const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

    const lastEntry = await prisma.holding_Information.findFirst({
  where: { is_deleted: false },
  orderBy: { id: 'desc' },
});

// ✅ পরবর্তী সিরিয়াল নাম্বার জেনারেট করো (যেমন HLD-0001)
let nextNumber = 1;

if (lastEntry && lastEntry.serial) {
  const lastNumber = parseInt(lastEntry.serial.replace("HLD-", ""));
  nextNumber = lastNumber + 1;
}

const nextSerial = `HLD-${String(nextNumber).padStart(4, "0")}`; // eg: HLD-0001


    const holding = await prisma.holding_Information.create({
      data: {
        ...body,
        dob: dobDate,
        insertedBy:userId,
         serial: nextSerial,
        is_deleted: false,   // নতুন ডাটা তৈরি হলে ডিফল্ট false
      },
    })

    return Response.json({ success: true, holding }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ PATCH (Update holding)
export async function PATCH(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    const body = await req.json()
    const dobDate = body.dob ? new Date(body.dob) : null

     
const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);
    const holding = await prisma.holding_Information.update({
      where: { id },
      data: {
        ...body,
        dob: dobDate,
        updatedBy:userId,
         
      },
    })

    return Response.json({ success: true, holding })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ Soft DELETE holding (is_deleted = true)
export async function DELETE(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))

    
    const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

    await prisma.holding_Information.update({
      where: { id },
      data: { is_deleted: true,deletedBy:userId },
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
