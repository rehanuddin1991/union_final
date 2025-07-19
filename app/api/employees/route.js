import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json({ success: true, employees })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const employee = await prisma.employees.create({
      data: body,
    })
    return Response.json({ success: true, employee }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    const body = await req.json()

    const employee = await prisma.employees.update({
      where: { id },
      data: body,
    })

    return Response.json({ success: true, employee })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))

    await prisma.employees.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
