import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit"; // ✅ fontkit ইম্পোর্ট
import "regenerator-runtime/runtime";  // ✅ নতুন লাইন

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ✅ 1) সব holding data নিন
    const holdings = await prisma.holding_Information.findMany({
      where: { is_deleted: false },
      orderBy: { id: "asc" },
    });

    if (!holdings || holdings.length === 0) {
      return NextResponse.json({ error: "No holding data found" }, { status: 404 });
    }

    // ✅ 2) বাংলা ফন্ট লোড করুন
    const fontPath = path.join(process.cwd(), "public", "fonts", "Nikosh.ttf");
    const customFontBytes = fs.readFileSync(fontPath);

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit); // ✅ fontkit রেজিস্টার করতে হবে
    const banglaFont = await pdfDoc.embedFont(customFontBytes);

    for (const holding of holdings) {
      // ✅ 3) QR Code তৈরি
      const qrDataUrl = await QRCode.toDataURL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-holding?id=${holding.id}`
      );

      const qrImageBytes = Buffer.from(
        qrDataUrl.replace(/^data:image\/png;base64,/, ""),
        "base64"
      );
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      // ✅ 4) প্রতিটি হোল্ডিং এর জন্য নতুন Page
      const page = pdfDoc.addPage([350, 200]); // Card Size (NID এর মতো)

      page.drawRectangle({
        x: 0,
        y: 0,
        width: 350,
        height: 200,
        color: rgb(0.9, 0.9, 0.95),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1.5,
      });

      page.drawText("স্মার্ট হোল্ডিং কার্ড", {
        x: 70,
        y: 175,
        size: 14,
        font: banglaFont,
        color: rgb(0.1, 0.3, 0.6),
      });

      page.drawText(`নাম: ${holding.headName}`, { x: 20, y: 150, size: 10, font: banglaFont });
      page.drawText(`পিতা: ${holding.father}`, { x: 20, y: 135, size: 10, font: banglaFont });
      page.drawText(`ওয়ার্ড: ${holding.ward} | হোল্ডিং নং: ${holding.holdingNo}`, {
        x: 20,
        y: 120,
        size: 10,
        font: banglaFont,
      });
      page.drawText(`মোবাইল: ${holding.mobile}`, { x: 20, y: 105, size: 10, font: banglaFont });
      page.drawText(`মোট কর: ${holding.imposedTax} টাকা`, {
        x: 20,
        y: 90,
        size: 10,
        font: banglaFont,
      });

      page.drawImage(qrImage, {
        x: 250,
        y: 60,
        width: 80,
        height: 80,
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=all_holding_cards.pdf",
      },
    });
  } catch (error) {
    console.error("❌ PDF Generate Error:", error);
    return NextResponse.json({ error: "Failed to generate card" }, { status: 500 });
  }
}
