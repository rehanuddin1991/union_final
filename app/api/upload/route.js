import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // Image কে base64 এ রূপান্তর
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const apiKey = process.env.IMGBB_API_KEY;

    // imgbb তে পাঠানো
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        image: base64Image,
      }),
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({ success: true, url: data.data.url });
    } else {
      return NextResponse.json(
        { success: false, message: "Image upload failed", error: data.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
