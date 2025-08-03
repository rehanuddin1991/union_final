import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    // Include holdingInformation relation to show headName etc
    const collections = await prisma.holdingCollection.findMany({
      include: { holdingInformation: true },
      orderBy: { createdAt: 'desc' },
      where: { is_deleted: false },
    })
    return Response.json({ success: true, collections })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const paymentDate = new Date(body.paymentDate)
     const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);
    

    const collection = await prisma.holdingCollection.create({
      data: {
        ...body,
        paymentDate,
        insertedBy:userId,
      },
    })

    return Response.json({ success: true, collection }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    const body = await req.json()
    const paymentDate = new Date(body.paymentDate)
     const token = req.cookies.get('token')?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

    const collection = await prisma.holdingCollection.update({
      where: { id },
      data: {
        ...body,
        paymentDate,
        updatedBy:userId,
      },
    })

    return Response.json({ success: true, collection })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));

    const token = req.cookies.get("token")?.value;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const userId = parseInt(payload.id);

     
    await prisma.holdingCollection.update({
      where: { id },
      data: {
        is_deleted: true,
        deletedBy: userId,
       
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

