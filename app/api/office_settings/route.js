import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const settings = await prisma.officeSettings.findMany({
      where: { is_deleted: false },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json({ success: true, settings })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    if ('id' in body) delete body.id

    const setting = await prisma.officeSettings.create({
      data: {
        ...body,
      },
    })

    return Response.json({ success: true, setting }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    if (!id) return Response.json({ success: false, error: 'ID missing' }, { status: 400 })

    const body = await req.json()
    if ('id' in body) delete body.id

    const setting = await prisma.officeSettings.update({
      where: { id },
      data: {
        ...body,
      },
    })

    return Response.json({ success: true, setting })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    if (!id) return Response.json({ success: false, error: 'ID missing' }, { status: 400 })

    await prisma.officeSettings.update({
      where: { id },
      data: { is_deleted: true },
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
