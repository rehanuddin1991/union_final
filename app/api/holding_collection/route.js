import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    // Include holdingInformation relation to show headName etc
    const collections = await prisma.holdingCollection.findMany({
      include: { holdingInformation: true },
      orderBy: { createdAt: 'desc' },
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

    const collection = await prisma.holdingCollection.create({
      data: {
        ...body,
        paymentDate,
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

    const collection = await prisma.holdingCollection.update({
      where: { id },
      data: {
        ...body,
        paymentDate,
      },
    })

    return Response.json({ success: true, collection })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))

    await prisma.holdingCollection.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
