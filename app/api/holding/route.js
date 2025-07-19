import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// ✅ GET all holdings
export async function GET() {
  try {
    const holdings = await prisma.holding_Information.findMany({
      orderBy: { id: 'desc' }
    })
    return Response.json({ success: true, holdings })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ POST new holding
export async function POST(req) {
  try {
    const body = await req.json()
    const dobDate = body.dob ? new Date(body.dob) : null

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

// ✅ PATCH (Update holding)
export async function PATCH(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    const body = await req.json()
    const dobDate = body.dob ? new Date(body.dob) : null

    const holding = await prisma.holding_Information.update({
      where: { id },
      data: {
        ...body,
        dob: dobDate,
      },
    })

    return Response.json({ success: true, holding })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ DELETE holding
export async function DELETE(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))

    await prisma.holding_Information.delete({
      where: { id },
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
