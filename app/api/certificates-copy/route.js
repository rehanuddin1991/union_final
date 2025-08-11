import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { jwtVerify } from 'jose';

import { NextResponse } from 'next/server'
function convertToBengaliNumber(number) {
  const bengaliDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return number.toString().split('').map(digit => bengaliDigits[parseInt(digit)]).join('');
}

export async function POST(req) {
  try {
    const { id, copyType  } = await req.json();
     

    if (!id) {
      return Response.json({ success: false, error: "ID is required" }, { status: 400 });
    }
    const cleanedType = copyType?.trim();

    const typeDataMap = {
  "নাগরিকত্ব সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "নাম সংক্রান্ত প্রত্যয়ন পত্র": `<p>তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা। সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি জন্মসূত্রে বাংলাদেশী নাগরিক। উক্ত ব্যক্তির জন্ম/জাতীয় সনদসহ অন্যান্য সনদে আবেদনকারীর নাম পরিলক্ষিত হলেও, ভুলবশত তাঁর নামীয় কিছু কাগজপত্রে (ভূমি/অন্যান্য) অন্য নাম লেখা আছে। আমার জানামতে, উভয় নাম একই ব্যক্তিকে নির্দেশ করে। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "চারিত্রিক সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন এবং তাঁর স্বভাব-চরিত্র ভালো। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "স্বামী পরিত্যক্তা সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি বিবাহিত ছিলেন কিন্তু বর্তমানে স্বামী পরিত্যক্তা। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "ভোটার স্থানান্তর সংক্রান্ত সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি পূর্বে অন্যত্র ভোটার ছিলেন। বর্তমানে তিনি উল্লিখিত ঠিকানায় বসবাস করছেন এবং ভোটার স্থানান্তরের জন্য উপযুক্ত। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "অবিবাহিত সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি জন্মসূত্রে বাংলাদেশী নাগরিক এবং বর্তমানে অবিবাহিত। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "দ্বিতীয়/পুনঃ বিবাহ না হওয়ার সনদপত্র": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি এখনও দ্বিতীয় বা পুনঃবিবাহ করেননি। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "বার্ষিক আয়ের সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তাঁর বার্ষিক আয় XXXX টাকা মাত্র। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "অভিভাবক সম্মতিপত্র": `<p>উল্লিখিত ব্যক্তি আমার সন্তান। তাকে বাংলাদেশ সেনা/পুলিশ/নৌ/বিমান/আনসার বাহিনীতে নিয়োগের জন্য স্ব-জ্ঞানে সম্মতি প্রদান করিলাম এবং আপনার সম্মুখে স্বাক্ষর প্রদান করিলাম। এই নিয়োগের ব্যাপারে আমার কিংবা আমার পরিবারের কোনো আপত্তি নাই।</p>`,

  "ভূমিহীন সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি ভূমিহীন। আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,
  "বিধবা সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি বিধবা। আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "বেকারত্ব সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি বর্তমানে বেকার এবং কোনো চাকরিতে নিয়োজিত নন। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`,

  "সম্প্রদায় সনদ": `<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি XXXX সম্প্রদায়ের সদস্য। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>`
};


    // পুরানো রেকর্ড ফেচ করা
    const oldData = await prisma.certificate.findUnique({
      where: { id: Number(id) },
    });

    if (!oldData) {
      return Response.json({ success: false, error: "Data not found" }, { status: 404 });
    }

    // পুরানো id, autoGenNum, createdAt বাদ
    const { id: oldId, autoGenNum, insertedAt, updatedAt, ...body } = oldData;
     

   if (cleanedType) {
      body.type = cleanedType;
      if (typeDataMap[cleanedType]) {
        body.notes = typeDataMap[cleanedType];
        body.is_copy=1
      }
    }

    // তারিখ ফিল্ড ঠিক করা
    if (body.birthDate) body.birthDate = new Date(body.birthDate);
    if (body.issuedDate) body.issuedDate = new Date(body.issuedDate);
    if (body.businessStartDate) body.businessStartDate = new Date(body.businessStartDate);

    // letter_count নতুন করে সেট করা
    const existingCount = await prisma.certificate.count({
      where: { type: body.type, is_deleted: false },
    });

    if (existingCount === 0) {
     // body.letter_count = parseInt(body.letter_count) || 1;
       body.letter_count = 1;

    } else {
      const maxLetterCount = await prisma.certificate.aggregate({
        _max: { letter_count: true },
        where: { type: body.type, is_deleted: false },
      });

      body.letter_count = (maxLetterCount._max.letter_count || 0) + 1;
    }

    // JWT থেকে userId বের করা
    const token = req.cookies.get("token")?.value;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userId = parseInt(payload.id);

    // নতুন রেকর্ড তৈরি
    const certificate = await prisma.certificate.create({
      data: { ...body, insertedBy: userId },
    });

    // Bengali autoGenNum তৈরি
    const bengaliId = convertToBengaliNumber(certificate.id);
    const newAutoGenNum = "২৫৪৬১৮০৫৭০১০০০০" + bengaliId;

    await prisma.certificate.update({
      where: { id: certificate.id },
      data: { autoGenNum: newAutoGenNum },
    });

    return Response.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    console.error("Certificate Copy Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
