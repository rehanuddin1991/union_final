import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { createCanvas, registerFont } from "canvas";
import "regenerator-runtime/runtime";

const prisma = new PrismaClient();
const office = await prisma.officeSettings.findFirst();
const unionTitle = office?.union_name || "ইউনিয়ন পরিষদ"; // fallback
async function textToImage(text, fontSize = 9, width = 260, height = 25, color = "#000") {
  const fontPath = path.join(process.cwd(), "public", "fonts", "Nikosh.ttf");
  registerFont(fontPath, { family: "Nikosh" });

  const scale = 2;
  const canvas = createCanvas(width * scale, height * scale);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, width * scale, height * scale);
  ctx.scale(scale, scale);

  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  ctx.shadowColor = "rgba(0,0,0,0.1)";
  ctx.shadowBlur = 1;

  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Nikosh`;
  ctx.fillText(text, 5, 0);

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

      const unionTitleImg = await pdfDoc.embedPng(
  await textToImage(unionTitle, 14, 260, 25, "#006400") // dark green
);

page.drawImage(unionTitleImg, { x: 60, y: 135, width: 260, height: 25 });

const titleImg = await pdfDoc.embedPng(
  await textToImage("স্মার্ট হোল্ডিং কার্ড", 14, 260, 20, "#800000") // maroon
);

page.drawImage(titleImg, { x: 80, y: 125, width: 260, height: 20 });

      let currentY = 105;

      const holdingImg = await pdfDoc.embedPng(
        await textToImage(`হোল্ডিং: ${holding.holdingNo}`, 11, 260, 15,"#008B8B")
      );
      page.drawImage(holdingImg, { x: 10, y: currentY, width: 260, height: 15 });


      currentY -= 15;

      const nameImg = await pdfDoc.embedPng(
        await textToImage(`নাম: ${holding.headName}`, 11, 260, 15,"#4B0082")
      );
      page.drawImage(nameImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const fatherImg = await pdfDoc.embedPng(
        await textToImage(`পিতা: ${holding.father}`, 11, 260, 15)
      );
      page.drawImage(fatherImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const motherImg = await pdfDoc.embedPng(
        await textToImage(`মাতা: ${holding.mother}`, 11, 260, 15,"#4B0082")
      );
      page.drawImage(motherImg, { x: 10, y: currentY, width: 260, height: 15  });
      currentY -= 15;

      const nidImg = await pdfDoc.embedPng(
        await textToImage(`NID: ${holding.nid || "NA"}`, 11, 260, 15,"#4B0082")
      );
      page.drawImage(nidImg, { x: 10, y: currentY, width: 260, height: 15  });
      currentY -= 15;

      const mobileImg = await pdfDoc.embedPng(
        await textToImage(`মোবাইল: ${holding.mobile || "NA"}`, 11, 260, 15,"#4B0082")
      );
      page.drawImage(mobileImg, { x: 10, y: currentY, width: 260, height: 15  });
      currentY -= 15;



      const wardImg = await pdfDoc.embedPng(
        await textToImage(`ওয়ার্ড: ${holding.ward}`, 11, 260, 15,"#4B0082")
      );
      page.drawImage(wardImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      const addressImg = await pdfDoc.embedPng(
        await textToImage(`ঠিকানা: ${holding.address}`, 11, 260, 15,"#4B0082")
      );
      page.drawImage(addressImg, { x: 10, y: currentY, width: 260, height: 15 });
      currentY -= 15;

      // const taxImg = await pdfDoc.embedPng(
      //   await textToImage(`মোট কর: ${holding.imposedTax} টাকা`, 11, 260, 15)
      // );
      // page.drawImage(taxImg, { x: 10, y: currentY, width: 260, height: 15 });

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
