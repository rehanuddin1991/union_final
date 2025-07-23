import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const holdings = await prisma.holding_Information.findMany({
      where: { is_deleted: false },   // শুধু is_deleted=false ডাটা নেবে
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

    const imposedTaxInt = body.imposedTax ? parseInt(body.imposedTax, 10) : 0

    const holding = await prisma.holding_Information.create({
      data: {
        ...body,
        dob: dobDate,
        imposedTax: imposedTaxInt,
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

    const imposedTaxInt = body.imposedTax ? parseInt(body.imposedTax, 10) : 0

    const holding = await prisma.holding_Information.update({
      where: { id },
      data: {
        ...body,
        dob: dobDate,
        imposedTax: imposedTaxInt,
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

    // সরাসরি ডিলিট না করে is_deleted true করে দিচ্ছি
    await prisma.holding_Information.update({
      where: { id },
      data: { is_deleted: true },
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
