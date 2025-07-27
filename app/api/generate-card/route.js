import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { createCanvas, registerFont } from "canvas";
import "regenerator-runtime/runtime";

const prisma = new PrismaClient();

async function textToImage(text, fontSize = 9, width = 260, height = 25) {
  const fontPath = path.join(process.cwd(), "public", "fonts", "Nikosh.ttf");
  registerFont(fontPath, { family: "Nikosh" });

  const scale = 2;
  const canvas = createCanvas(width * scale, height * scale);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, width * scale, height * scale); // Clear full canvas
  ctx.scale(scale, scale); // scale down so drawing matches intended size

  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  // Optional subtle shadow for clarity
  ctx.shadowColor = "rgba(0,0,0,0.1)";
  ctx.shadowBlur = 1;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = "#000"; // cadet blue color
  ctx.font = `${fontSize}px Nikosh`;
  ctx.fillText(text, 5, 0); // y=0 since baseline is top

  return canvas.toBuffer("image/png");
}

export async function GET() {
  try {
    const holdings = await prisma.holding_Information.findMany({
      where: { is_deleted: false },
      orderBy: { id: "asc" },
    });

    if (!holdings || holdings.length === 0) {
      return NextResponse.json({ error: "No holding data found" }, { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();

    for (const holding of holdings) {
      const qrDataUrl = await QRCode.toDataURL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-holding?id=${holding.id}`
      );
      const qrImageBytes = Buffer.from(
        qrDataUrl.replace(/^data:image\/png;base64,/, ""),
        "base64"
      );
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      // Card size [300, 180]
      const page = pdfDoc.addPage([250, 170]);

      // Draw background with whitesmoke and cadet blue border
      page.drawRectangle({
        x: 0,
        y: 0,
        width: 300,
        height: 180,
        color: rgb(0.96, 0.96, 0.96),       // whitesmoke
        borderColor: rgb(0.37, 0.62, 0.63), // cadet blue
        borderWidth: 2,
      });

      // Title: ইউনিয়ন পরিষদ
      const unionTitleImg = await pdfDoc.embedPng(
        await textToImage("১নং রামগড় ইউনিয়ন পরিষদ", 14, 260, 25)
      );
      page.drawImage(unionTitleImg, { x: 60, y: 145, width: 260, height: 25 });

      // Subtitle: স্মার্ট হোল্ডিং কার্ড
      const titleImg = await pdfDoc.embedPng(
        await textToImage("স্মার্ট হোল্ডিং কার্ড", 14, 260, 20)
      );
      page.drawImage(titleImg, { x: 80, y: 135, width: 260, height: 20 });

      let currentY = 125;

      const holdingImg = await pdfDoc.embedPng(
        await textToImage(`হোল্ডিং: ${holding.holdingNo}`, 11, 260, 15)
      );
      page.drawImage(holdingImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const nameImg = await pdfDoc.embedPng(
        await textToImage(`নাম: ${holding.headName}`, 11, 260, 15)
      );
      page.drawImage(nameImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const fatherImg = await pdfDoc.embedPng(
        await textToImage(`পিতা: ${holding.father}`, 11, 260, 15)
      );
      page.drawImage(fatherImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const motherImg = await pdfDoc.embedPng(
        await textToImage(`মাতা: ${holding.mother}`, 11, 260, 15)
      );
      page.drawImage(motherImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const nidImg = await pdfDoc.embedPng(
        await textToImage(`NID: ${holding.nid || "NA"}`, 11, 260, 15)
      );
      page.drawImage(nidImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const wardImg = await pdfDoc.embedPng(
        await textToImage(`ওয়ার্ড: ${holding.ward}`, 11, 260, 15)
      );
      page.drawImage(wardImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const addressImg = await pdfDoc.embedPng(
        await textToImage(`ঠিকানা: ${holding.address}`, 11, 260, 15)
      );
      page.drawImage(addressImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const taxImg = await pdfDoc.embedPng(
        await textToImage(`মোট কর: ${holding.imposedTax} টাকা`, 11, 260, 15)
      );
      page.drawImage(taxImg, { x: 10, y: currentY, width: 260, height: 15 });

      // QR কোড
      page.drawImage(qrImage, {
        x: 180,
        y: 20,
        width: 60,
        height: 60,
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
