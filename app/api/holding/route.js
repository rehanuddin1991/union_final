import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const dynamic = "force-dynamic"; // ✅ Vercel এ build time এ প্রি-রেন্ডার করবে না

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

    const holding = await prisma.holding_Information.create({
      data: {
        ...body,
        dob: dobDate,
         
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
