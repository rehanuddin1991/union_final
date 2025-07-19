import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const holdings = await prisma.holding_Information.findMany()
    return Response.json({ success: true, holdings })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const dobDate = new Date(body.dob)

    const holding = await prisma.holding_Information.create({
  data: {
    ...body,
    dob: dobDate,
  },
})

     
    return Response.json({ success: true, holding }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    const body = await req.json()
    const dobDate = new Date(body.dob)

     const holding = await prisma.holding_Information.update({where: { id },
  data: {
    ...body,
    dob: dobDate,
  },
})

   // const holding = await prisma.holding_Information.update({ where: { id }, data: body })
    return Response.json({ success: true, holding })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    await prisma.holding_Information.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
