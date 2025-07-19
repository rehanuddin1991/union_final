"use client";
import { useEffect, useState, useRef } from "react";
//import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { commonPrintStyles, taxTableStyles  } from "@/utils_js/helpers/printStyles";
  

import { preloadImage, openPrintWindow,generateSignatureHTML,generateApplicantInfoRows } from "@/utils_js/helpers/printHelpers";

import dynamic from "next/dynamic";
import {
  convertToBanglaNumber,
  numberToBanglaWords,
  bnToEnNumber,
} from "@/utils_js/utils";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [settings, setSettings] = useState(null);
  const [now, setNow] = useState(null);

  const fetchOfficeSettings = async () => {
    const res = await fetch("/api/office_settings");
    const data = await res.json();
    if (data.success) {
      setSettings(data.settings[0]);
      console.log("dddddd" + settings);
    } else toast.error("অফিস সেটিংস লোড করতে ব্যর্থ হয়েছে");
  };

  const handleLoadDefaultNote = () => {
    const defaultNote = `
    <p>তিনি উপরোক্ত ঠিকানার একজন স্থায়ী বাসিন্দা এবং ব্যক্তিগতভাবে আমার পরিচিত। আমার জানামতে তিনি জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র বা সমাজ বিরোধী কোনো কার্যকলাপের সঙ্গে জড়িত নন।
      আমি তাহার সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করছি।</p>
     
  `;
    setForm({ ...form, notes: defaultNote });
  };

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    if (data.success) setEmployees(data.employees);
    else toast.error("Failed to load employees");
  };
  const today = new Date().toISOString().substring(0, 10);
  const [form, setForm] = useState({
    id: null,
    type: "",
    applicantName: "",
    fatherName: "",
    motherName: "",
    spouse: "",
    birthDate: "",
    address: "",
    issuedDate: today,
    nid: "",
    birth_no: "",
    ward: "",
    mouza: "",
    post_office: "",
    holding_no: "",
    notes: "",
    letter_count: "",
    trade_name: "",
    trade_address: "",

    trade_fee: "",
    trade_capital_tax: "",
    trade_due: "",
    trade_vat: "",
    trade_total_tax: "",
    trade_type: "",
    fiscalYear: "Y2025_2026", // default
    fiscalYearEnd: "Y2025_2026", // default
  });

  const printRef = useRef();

  // Load all certificates
  const fetchCertificates = async () => {
    const res = await fetch("/api/certificates");
    const data = await res.json();
    if (data.success) setCertificates(data.certificates);
    else toast.error("Failed to load certificates");
  };

  useEffect(() => {
    fetchCertificates();
    fetchEmployees();
    fetchOfficeSettings();
    setNow(new Date().toLocaleDateString());
  }, []);

  const signer2 = employees[1] || {
    name: " ",
    designation: "প্রশাসনিক কর্মকর্তা",
    office1: "১নং রামগড় ইউনিয়ন পরিষদ",
    office2: " ",
    office3: " ",
    office4: "রামগড়, খাগড়াছড়ি",
  };

  const signer = employees[0] || {
    name: " ",
    designation: "দায়িত্বপ্রাপ্ত কর্মকর্তা",
    office1: "১নং রামগড় ইউনিয়ন পরিষদ",
    office2: " ",
    office3: " ",
    office4: "রামগড়, খাগড়াছড়ি",
  };

  const designationText =
    signer.designation === "OFFICER_IN_CHARGE"
      ? "দায়িত্বপ্রাপ্ত কর্মকর্তা"
      : "চেয়ারম্যান";

  const designationText2 = "ইউপি প্রশাসনিক কর্মকর্তা";

  const resetForm = () => {
    setForm({
      id: null,
      type: "",
      applicantName: "",
      fatherName: "",
      motherName: "",
      spouse: "", // ✅ spouse
      birthDate: "",
      address: "",
      issuedDate: today,
      nid: "",
      birth_no: "", // ✅ birth_no
      ward: "",
      mouza: "",
      post_office: "",
      holding_no: "",
      notes: "",
      trade_name: "",
      trade_address: "",

      trade_fee: "",
      trade_capital_tax: "",
      trade_due: "",
      trade_vat: "",
      trade_total_tax: "",
      trade_type: "",
      fiscalYear: "Y2025_2026", // default
      fiscalYearEnd: "Y2025_2026", // default
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let letter_count = 1; // default

    const firstLetterCount = certificates[0]?.letter_count;

    if (
      firstLetterCount === null ||
      firstLetterCount === 0 ||
      isNaN(firstLetterCount)
    ) {
      letter_count = parseInt(form.letter_count) || 1;
    } else {
      letter_count = firstLetterCount + 1;
    }

    const payload = {
      ...form,
      letter_count: parseInt(letter_count), // include it in payload
    };

    const method = form.id ? "PATCH" : "POST";
    const url = form.id
      ? `/api/certificates?id=${form.id}`
      : "/api/certificates";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(form.id ? "Updated Successfully" : "Added Successfully");
        resetForm();
        fetchCertificates();
      } else {
        toast.error("Operation failed");
      }
    } catch {
      toast.error("Error Occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ডিলিট নিশ্চিত করবেন?")) return;
    const res = await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Deleted Successfully");
      fetchCertificates();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (cert) => {
    setForm({
      id: cert.id,
      type: cert.type,
      applicantName: cert.applicantName,
      fatherName: cert.fatherName || "",
      motherName: cert.motherName || "",
      spouse: cert.spouse || "",
      birthDate: cert.birthDate ? cert.birthDate.substring(0, 10) : "",
      address: cert.address || "",
      issuedDate: cert.issuedDate ? cert.issuedDate.substring(0, 10) : today,
      nid: cert.nid || "",
      birth_no: cert.birth_no || "", // ✅ birth_no
      ward: cert.ward || "",
      mouza: cert.mouza || "",
      post_office: cert.post_office || "",
      holding_no: cert.holding_no || "",
      notes: cert.notes || "",
      trade_name: cert.trade_name || "",
      trade_address: cert.trade_address || "",

      trade_fee: cert.trade_fee || "",
      trade_capital_tax: cert.trade_capital_tax || "",
      trade_due: cert.trade_due || "",
      trade_vat: cert.trade_vat || "",
      trade_total_tax: cert.trade_total_tax || "",
      trade_type: cert.trade_type || "",
      fiscalYear: cert.fiscalYear || "Y2025_2026",
      fiscalYearEnd: cert.fiscalYearEnd || "Y2025_2026",
    });
  };

  // const formatDate = (date) => {
  //   const d = new Date(date);
  //   return d
  //     .toLocaleDateString("bn-BD", {
  //       day: "numeric",
  //       month: "long",
  //       year: "numeric",
  //     })
  //     .replace(/,/, ""); // এখানে কমা সরানো হয়েছে
  // };

  const formatDobDate = (date) => {
    const data = date?.substring(0, 10).split("-");
    return `${data[2]}-${data[1]}-${data[0]}`;
    if (!date || date.length !== 8) return date; // 8 digit হলে মনে করব yyyymmdd
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${day}-${month}-${year}`;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePrint = async (cert) => {
    const origin = window.location.origin;
    const dob= formatDobDate(cert.birthDate?.substring(0, 10))  ;
    const applicantInfoRows = generateApplicantInfoRows(cert, dob);


    const govtImg = `${origin}/images/govt.png`;
    const unionImg = `${origin}/images/union2.png`;
    const qrImg = `${origin}/images/qr.png`;
    const qrUrl = `${origin}/verify/certificate?id=${cert.id}`;
    const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrUrl
    )}&size=100x100`;
    //const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=https://google.com&size=150x150`;

     // ✅ প্রিলোড ইমেজ
  try {
    await Promise.all([preloadImage(govtImg), preloadImage(unionImg)]);
  } catch (err) {
    console.error("Error preloading images:", err);
  }

  const signatureHTML = generateSignatureHTML(
  signer,
  signer2,
  designationText,
  designationText2,
  settings,
  qrImg_with_link
);

    const printContents = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${cert.type || "Certificate"}</title>
       <style>
        ${commonPrintStyles.replace("__UNION_IMG__", unionImg)}
      </style>
    </head>
    <body>
      <div class="outer-border">
        <div class="middle-border">
          <div class="inner-border">
            <div class="watermark"></div>

            <div class="header-section">
              <img src="${govtImg}" class="header-logo" alt="Government Logo" />
              <h3 class="header-title">${settings?.notes || ""}</h3>
              <img src="${unionImg}" class="header-logo" alt="Union Logo" />
            </div>

            

            <div class="top-section">
              <p>স্মারক নং: ${settings?.sarok_no}${settings?.letter_count}</p>
              <p>তারিখ: ${formatDate(cert.issuedDate || new Date())}</p>
            </div>

            <div style="border: 1px solid green;margin:auto; background-color: #e6f4ea; padding: 5px; margin-top: 15px; border-radius: 7px; width: 200px; text-align: center;">
  <h1 style="font-size: 15px; color: green; margin: auto;">
    ${cert.type || "সার্টিফিকেট"}
  </h1>
</div>



            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;প্রত্যয়ন করা যাচ্ছে যে,</p>

            <table>
  <tr>
    <td style="width: 30%;">নাম</td>
    <td style="margin-left:20px;">: ${cert.applicantName}</td>
  </tr>
   ${applicantInfoRows}
  <tr>
    <td>ওয়ার্ড</td>
    <td>: ${cert.ward || "-"}</td>
    </tr>
    <tr>
    <td>হোল্ডিং নং</td>
    <td>: ${cert.holding_no || "-"}</td>
  </tr>
   
    
   
  <tr>
    <td>মৌজা</td>
    <td>: ${cert.mouza || "-"}</td>
  </tr>
  <tr>
    <td>ডাকঘর</td>
    <td>: ${cert.post_office || "-"}</td>
  </tr>
   
</table>
<div style="text-align:justify; line-height:1.6">
  ${cert.notes || "-"}
</div>


          

             ${signatureHTML}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

     openPrintWindow(printContents);
  };

  const handlePrint_trade = async (cert) => {
    const origin = window.location.origin;
    const dob= formatDobDate(cert.birthDate?.substring(0, 10))  ;
    const applicantInfoRows = generateApplicantInfoRows(cert, dob);

    const [startYear, endYear] = cert.fiscalYearEnd.split("_");
    const [fiscal_start, fiscal_end_bk] = cert.fiscalYear.split("_");
    const [fiscal_start_bk, fiscal_end] = cert.fiscalYearEnd.split("_");

    const govtImg = `${origin}/images/govt.png`;
    const unionImg = `${origin}/images/union2.png`;
    const qrImg = `${origin}/images/qr.png`;
    const qrUrl = `${origin}/verify/certificate?id=${cert.id}`;
    const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrUrl
    )}&size=100x100`;
    //const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=https://google.com&size=150x150`;

    // ✅ প্রিলোড ইমেজ
  try {
    await Promise.all([preloadImage(govtImg), preloadImage(unionImg)]);
  } catch (err) {
    console.error("Error preloading images:", err);
  }

  const signatureHTML = generateSignatureHTML(
  signer,
  signer2,
  designationText,
  designationText2,
  settings,
  qrImg_with_link
);

    const printContents = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${cert.type || "Certificate"}</title>
        <style>
        ${commonPrintStyles.replace("__UNION_IMG__", unionImg)}
        ${taxTableStyles}
      </style>
    </head>
    <body>
      <div class="outer-border">
        <div class="middle-border">
          <div class="inner-border">
            <div class="watermark"></div>

            <div class="header-section">
              <img src="${govtImg}" class="header-logo" alt="Government Logo" />
              <h3 class="header-title">${settings?.notes || ""}</h3>
              <img src="${unionImg}" class="header-logo" alt="Union Logo" />
            </div>

            

            <div class="top-section">
              <p>স্মারক নং: ${settings?.sarok_no}${settings?.letter_count}</p>
              <p>তারিখ: ${formatDate(cert.issuedDate || new Date())}</p>
            </div>

            <div style="border: 1px solid green;margin:auto; background-color: #e6f4ea; padding: 5px; margin-top: 15px; border-radius: 7px; width: 200px; text-align: center;">
  <h1 style="font-size: 15px; color: green; margin: auto;">
    ${cert.type || "সার্টিফিকেট"}
  </h1>
</div>



            

            <table>
            <tr>
    <td style="width: 30%;">প্রতিষ্ঠানের নাম</td>
    <td style="margin-left:20px;">: ${cert.trade_name}</td>
  </tr>


   <tr>
    <td style="width: 30%;">পেশা ও ব্যবসার ধরণ</td>
    <td style="margin-left:20px;">: ${cert.trade_type}</td>
  </tr>


  <tr>
    <td style="width: 30%;">প্রতিষ্ঠানের ঠিকানা</td>
    <td style="margin-left:20px;">: ${cert.trade_address}</td>
  </tr>


  <tr>
    <td style="width: 30%;">লাইসেন্সধারীর নাম</td>
    <td style="margin-left:20px;">: ${cert.applicantName}</td>
  </tr>
  ${applicantInfoRows}
   

  <hr>

   
  

  


    



   
</table>
<div class="container2">
  <table class="tax-table">
    <tbody>
      <tr class="header-row">
        <td colspan="2" class="header-cell">
          ট্যাক্স বিবরণী
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">ট্রেড লাইসেন্স ফি</td>
        <td class="input-cell">
          <input type="text"  value=${cert.trade_fee || "০"} />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">মুলধন কর</td>
        <td class="input-cell">
          <input type="text" value=${cert.trade_capital_tax || "০"} />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">বকেয়া</td>
        <td class="input-cell">
          <input type="text"  value=${cert.trade_due || "০"} />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">ভ্যাট (%)</td>
        <td class="input-cell">
          <input type="text"   value=${cert.trade_vat || "০"}  />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">সর্বমোট কর</td>
        <td class="input-cell">
         <span>${cert.trade_total_tax} ( ${numberToBanglaWords(
      bnToEnNumber(cert.trade_total_tax)
    )} টাকা মাত্র)</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>



<div style="margin-top:5px;">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; উল্লেখিত পেশা ও ব্যবসা বাণিজ্য পরিচালনার নিমিত্ত  আর্থিক বছর ${convertToBanglaNumber(
      fiscal_start
    )}-${convertToBanglaNumber(
      fiscal_end
    )} সালের জন্য লাইসেন্স প্রদান করা হলো। অত্র লাইসেন্স ${convertToBanglaNumber(
      endYear
    )} সালের ৩০শে জুন পর্যন্ত কার্যকর থাকবে।

</div>
 


          

              ${signatureHTML}

          </div>
        </div>
      </div>

      <br>
      <br>
      <br>

      <div class="outer-border">
        <div class="middle-border">
          <div class="inner-border">
            <div class="watermark"></div>

            <div class="header-section">
              <img src="${govtImg}" class="header-logo" alt="Government Logo" />
              <h3 class="header-title">${settings?.notes || ""}</h3>
              <img src="${unionImg}" class="header-logo" alt="Union Logo" />
            </div>

            

            <div class="top-section">
              <p>স্মারক নং: ${settings?.sarok_no}${settings?.letter_count}</p>
              <p>তারিখ: ${formatDate(cert.issuedDate || new Date())}</p>
            </div>

            <div style="border: 1px solid green;margin:auto; background-color: #e6f4ea; padding: 5px; margin-top: 15px; border-radius: 7px; width: 200px; text-align: center;">
  <h1 style="font-size: 15px; color: green; margin: auto;">
    ${cert.type || "সার্টিফিকেট"} (অফিস কপি)
  </h1>
</div>



            

            <table>
            <tr>
    <td style="width: 30%;">প্রতিষ্ঠানের নাম</td>
    <td style="margin-left:20px;">: ${cert.trade_name}</td>
  </tr>


   <tr>
    <td style="width: 30%;">পেশা ও ব্যবসার ধরণ</td>
    <td style="margin-left:20px;">: ${cert.trade_type}</td>
  </tr>


  <tr>
    <td style="width: 30%;">প্রতিষ্ঠানের ঠিকানা</td>
    <td style="margin-left:20px;">: ${cert.trade_address}</td>
  </tr>


  <tr>
    <td style="width: 30%;">লাইসেন্সধারীর নাম</td>
    <td style="margin-left:20px;">: ${cert.applicantName}</td>
  </tr>
  <tr>
    <td>পিতার নাম</td>
    <td>: ${cert.fatherName || "-"}</td>
  </tr>
  <tr>
    <td>মাতার নাম</td>
    <td>: ${cert.motherName || "-"}</td>
  </tr>

   <tr>
    <td>জাতীয় পরিচয়পত্র নম্বর:</td>
    <td>: ${cert.nid || "-"}</td>
  </tr>

    


   
</table>
<div class="container2">
  <table class="tax-table">
    <tbody>
      <tr class="header-row">
        <td colspan="2" class="header-cell">
          ট্যাক্স বিবরণী
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">ট্রেড লাইসেন্স ফি</td>
        <td class="input-cell">
          <input type="text"  value=${cert.trade_fee || "০"} />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">মুলধন কর</td>
        <td class="input-cell">
          <input type="text" value=${cert.trade_capital_tax || "০"} />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">বকেয়া</td>
        <td class="input-cell">
          <input type="text"  value=${cert.trade_due || "০"} />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">ভ্যাট (%)</td>
        <td class="input-cell">
          <input type="text"   value=${cert.trade_vat || "০"}  />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">সর্বমোট কর</td>
        <td class="input-cell">
         <span>${cert.trade_total_tax} ( ${numberToBanglaWords(
      bnToEnNumber(cert.trade_total_tax)
    )} টাকা মাত্র)</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>



 
 


          

            <div class="signature-area">
            

              

              <div class="signature-box" >
                <p style="margin-left:400px; margin-top:50px; width: 200px; padding-top: 5px;">   আদায়কারীর স্বাক্ষর </p>
               
                
              </div>
            
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

       openPrintWindow(printContents);

  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ইউনিয়ন পরিষদ সকল সনদ</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border p-6 rounded-xl shadow mb-8 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-indigo-700">সনদের ধরন</label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">-- সনদের ধরন নির্বাচন করুন --</option>
              <option value="নাগরিকত্ব সনদ">নাগরিকত্ব সনদ</option>
              <option value="জাতীয়তা সনদ">জাতীয়তা সনদ</option>
              <option value="ওয়ারিশ সনদ">ওয়ারিশ সনদ</option>
              <option value="বার্ষিক আয়ের সনদ">বার্ষিক আয়ের সনদ</option>
              <option value="ট্রেড লাইসেন্স">ট্রেড লাইসেন্স</option>
              <option value="বিবিধ সনদ">বিবিধ সনদ</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              আবেদনকারীর নাম
            </label>
            <input
              type="text"
              required
              value={form.applicantName}
              onChange={(e) =>
                setForm({ ...form, applicantName: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="আবেদনকারীর নাম"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">পিতার নাম</label>
            <input
              type="text"
              value={form.fatherName}
              onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="পিতার নাম"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">মাতার নাম</label>
            <input
              type="text"
              value={form.motherName}
              onChange={(e) => setForm({ ...form, motherName: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="মাতার নাম"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              স্বামী/স্ত্রীর নাম
            </label>
            <input
              type="text"
              value={form.spouse}
              onChange={(e) => setForm({ ...form, spouse: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="স্বামী/স্ত্রীর নাম"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">জন্ম তারিখ</label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              জাতীয় পরিচয়পত্র নম্বর
            </label>
            <input
              type="text"
              value={form.nid}
              onChange={(e) => setForm({ ...form, nid: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="NID"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              জন্ম নিবন্ধন নম্বর
            </label>
            <input
              type="text"
              value={form.birth_no}
              onChange={(e) => setForm({ ...form, birth_no: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="জন্ম নিবন্ধন নম্বর"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">ওয়ার্ড</label>
            <input
              type="text"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="ওয়ার্ড"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">হোল্ডিং</label>
            <input
              type="text"
              value={form.holding_no}
              onChange={(e) => setForm({ ...form, holding_no: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="হোল্ডিং"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">মৌজা</label>
            <input
              type="text"
              value={form.mouza}
              onChange={(e) => setForm({ ...form, mouza: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="মৌজা"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">পোস্ট অফিস</label>
            <input
              type="text"
              value={form.post_office}
              onChange={(e) =>
                setForm({ ...form, post_office: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="পোস্ট অফিস"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold text-indigo-700">ঠিকানা</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="ঠিকানা"
              rows={2}
            />
          </div>

          {form.type === "ট্রেড লাইসেন্স" && (
            <>
              <div>
                <label className="font-semibold text-indigo-700">
                  প্রতিষ্ঠানের নাম
                </label>
                <input
                  type="text"
                  value={form.trade_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, trade_name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="ট্রেডের নাম"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  প্রতিষ্ঠানের ঠিকানা
                </label>
                <input
                  type="text"
                  value={form.trade_address || ""}
                  onChange={(e) =>
                    setForm({ ...form, trade_address: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="ট্রেডের ঠিকানা"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  ট্রেডের ধরন
                </label>
                <input
                  type="text"
                  value={form.trade_type}
                  onChange={(e) =>
                    setForm({ ...form, trade_type: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="ট্রেডের ধরন"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  {" "}
                  ট্রেড লাইসেন্স ফি
                </label>
                <input
                  type="text"
                  value={form.trade_fee}
                  onChange={(e) =>
                    setForm({ ...form, trade_fee: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="ট্রেড লাইসেন্স ফি"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  মুলধন কর
                </label>
                <input
                  type="text"
                  value={form.trade_capital_tax}
                  onChange={(e) =>
                    setForm({ ...form, trade_capital_tax: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="মুলধন কর"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">বকেয়া</label>
                <input
                  type="text"
                  value={form.trade_due}
                  onChange={(e) =>
                    setForm({ ...form, trade_due: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="বকেয়া"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">ভ্যাট</label>
                <input
                  type="text"
                  value={form.trade_vat}
                  onChange={(e) =>
                    setForm({ ...form, trade_vat: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="ভ্যাট"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  সর্বমোট কর
                </label>
                <input
                  type="text"
                  value={form.trade_total_tax}
                  onChange={(e) =>
                    setForm({ ...form, trade_total_tax: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="মোট কর"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  অর্থবছর (শুরু)
                </label>
                <select
                  value={form.fiscalYear}
                  onChange={(e) =>
                    setForm({ ...form, fiscalYear: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="Y2024_2025">২০২৪-২৫</option>
                  <option value="Y2025_2026">২০২৫-২৬</option>
                  <option value="Y2026_2027">২০২৬-২৭</option>
                  <option value="Y2027_2028">২০২৭-২৮</option>
                  <option value="Y2028_2029">২০২৮-২৯</option>
                  <option value="Y2029_2030">২০২৯-৩০</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  অর্থবছর (শেষ)
                </label>
                <select
                  value={form.fiscalYearEnd}
                  onChange={(e) =>
                    setForm({ ...form, fiscalYearEnd: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="Y2024_2025">২০২৪-২৫</option>
                  <option value="Y2025_2026">২০২৫-২৬</option>
                  <option value="Y2026_2027">২০২৬-২৭</option>
                  <option value="Y2027_2028">২০২৭-২৮</option>
                  <option value="Y2028_2029">২০২৮-২৯</option>
                  <option value="Y2029_2030">২০২৯-৩০</option>
                </select>
              </div>
            </>
          )}

          {certificates.length === 0 && (
            <div>
              <label className="font-semibold text-indigo-700">
                সনদের নাম্বার (শুধু প্রথমটির জন্য)
              </label>
              <input
                type="text"
                value={form.letter_count}
                onChange={(e) =>
                  setForm({ ...form, letter_count: e.target.value })
                }
                className="border p-2 rounded w-full"
                placeholder="Letter Count"
                required
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-indigo-700">
              জারি করার তারিখ
            </label>
            <input
              type="date"
              value={form.issuedDate}
              onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-semibold text-indigo-700">নোটস</label>
          <button
            type="button"
            onClick={handleLoadDefaultNote}
            className="bg-green-500 text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default
          </button>
          <Editor
            apiKey="fg6rfz4onq5dx0irorid2gyjdbh9xdpg01k2kdcqk7594hd2"
            value={form.notes}
            init={{
              height: 200,
              menubar: false,
              directionality: "ltr",
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={(content) => setForm({ ...form, notes: content })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mt-4"
        >
          {form.id ? "আপডেট করুন" : "সেভ করুন"}
        </button>

        {form.id && (
          <button
            type="button"
            onClick={() => resetForm()}
            className="w-full mt-2 bg-gray-400 text-white py-2 rounded"
          >
            নতুন ফরম
          </button>
        )}
      </form>

      <div className="bg-white border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">সনদ তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-2">সনদের ধরন</th>
              <th className="border p-2">আবেদনকারীর নাম</th>
              <th className="border p-2">পিতার নাম</th>
              <th className="border p-2">মাতার নাম</th>
              <th className="border p-2">জন্ম তারিখ</th>
              <th className="border p-2">ঠিকানা</th>
              <th className="border p-2">জারি তারিখ</th>
              <th className="border p-2">নোটস</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  কোনো সনদ পাওয়া যায়নি।
                </td>
              </tr>
            )}
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td className="border p-2">{cert.type}</td>
                <td className="border p-2">{cert.applicantName}</td>
                <td className="border p-2">{cert.fatherName || "-"}</td>
                <td className="border p-2">{cert.motherName || "-"}</td>
                <td className="border p-2">
                  {cert.birthDate ? cert.birthDate.substring(0, 10) : "-"}
                </td>
                <td className="border p-2">{cert.address || "-"}</td>
                <td className="border p-2">
                  {cert.issuedDate ? cert.issuedDate.substring(0, 10) : "-"}
                </td>
                <td className="border p-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: cert.notes || "-" }}
                  />
                </td>
                <td className="border p-2 space-x-1">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="text-red-600"
                  >
                    🗑
                  </button>
                   {cert.type != "ট্রেড লাইসেন্স" && (
                  <button
                    onClick={() => handlePrint(cert)}
                    className="text-green-600"
                  >
                    🖨️
                  </button>)}

                  {cert.type === "ট্রেড লাইসেন্স" && (
  <button
    onClick={() => handlePrint_trade(cert)}
    className="text-green-600"
  >
    🖨️ Trade
  </button>
)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
