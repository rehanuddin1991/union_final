import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  if (!id) {
    return Response.json({ success: false, message: "Missing or invalid ID" }, { status: 400 });
  }

  try {
    const data = await prisma.holdingCollection.findUnique({
      where: {
        id: id,
      },
      include: {
        holdingInformation: true, // Join with holding_information
      },
    });

    if (!data) {
      return Response.json({ success: false, message: "Data not found" }, { status: 404 });
    }

    return Response.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error("Error fetching collection by ID:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
