import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("image");

    if (!file || !file.arrayBuffer) {
      return NextResponse.json({ success: false, message: "No image file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const apiKey = process.env.IMGBB_API_KEY;
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ image: base64Image }),
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ url: result.data.url }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ success: false, message: "Error uploading image" }, { status: 500 });
  }
}
