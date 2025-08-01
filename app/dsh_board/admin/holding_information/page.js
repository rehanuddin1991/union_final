"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  commonPrintStyles,
  taxTableStyles,
} from "@/utils_js/helpers/printStyles";

import {
  getHeaderSection,
  getHeaderSectionTrade,
  preloadImage,
  openPrintWindow,
  generateSignatureHTML,
  generateApplicantInfoRows,
} from "@/utils_js/helpers/printHelpers";

import dynamic from "next/dynamic";
import {
  enToBnNumber,
  convertToBanglaNumber,
  numberToBanglaWords,
  bnToEnNumber,
} from "@/utils_js/utils";

export default function HoldingPage() {
   
  
  const [employees, setEmployees] = useState([]);
  const [settings, setSettings] = useState(null);

   const fetchOfficeSettings = async () => {
    const res = await fetch("/api/office_settings");
    const data = await res.json();
    if (data.success) {
      setSettings(data.settings[0]);
      //console.log("dddddd" + data.settings[0]);
    } else toast.error("অফিস সেটিংস লোড করতে ব্যর্থ হয়েছে");
  };
   const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    if (data.success) setEmployees(data.employees);
    else toast.error("Failed to load employees");
  };

   useEffect(() => {
     
    fetchEmployees();
    fetchOfficeSettings();
     
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
    
  const [form, setForm] = useState({
    headName: "",
    ward: "1",
    holdingNo: "",
    father: "",
    mother: "",
    nid: "",
    mobile: "",
    dob: "",
    gender: "MALE",
    religion: "ISLAM",
    comments: "",
    rawRoom: "",
    occupation: "",
    maleMembers: "",
    femaleMembers: "",
    othersMembers: "",
    maleBaby: "",
    femaleBaby: "",
    othersBaby: "",
    address: "",
    area: "",
    multiStoriedRoom: "",
    buildingRoom: "",
    semiBuildingRoom: "",
    ownHouseRent: "",
    othersRent: "",
    imposedTax: "",
  });

  const [holdings, setHoldings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHoldings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/holding");
      const data = await res.json();
      setHoldings(data.holdings || []);
    } catch (err) {
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

   const formatDobDate = (date) => {
    const data = date?.substring(0, 10).split("-");
    return `${data[2]}-${data[1]}-${data[0]}`;
    if (!date || date.length !== 8) return date; // 8 digit হলে মনে করব yyyymmdd
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${day}-${month}-${year}`;
  };


  const handlePrint = async (cert) => {
     setIsLoading(true); // ⬅️ লোডিং শুরু
  try {
    const origin = window.location.origin;
    const dob = formatDobDate(cert.dob?.substring(0, 10));
    const [day, month, year] = dob.split("-");

    const bnDob = `${enToBnNumber(day)}-${enToBnNumber(month)}-${enToBnNumber(
      year
    )}`;
    const applicantInfoRows = generateApplicantInfoRows(cert, bnDob);
    // const issue_date_format = formatDate(cert.issuedDate || new Date());
    // const [issue_day, issue_month, issue_year] = issue_date_format.split("-");
    // const bnIssueDate = `${enToBnNumber(issue_day)}-${enToBnNumber(
    //   issue_month
    // )}-${enToBnNumber(issue_year)}`;

    const govtImg = `${origin}/images/govt.png`;
    const unionImg = settings?.imageUrl || `${origin}/images/union.png`;

    const qrImg = `${origin}/images/qr.png`;
    const qrUrl = `${origin}/verify/holding?id=${cert.id}`;
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

    const headerHTML = getHeaderSection(settings, govtImg, unionImg);

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
             

            ${headerHTML}

            <hr>

             

            <div style="border: 1px solid green;margin:auto; background-color: #e6f4ea; padding: 5px; margin-top: 15px; border-radius: 7px;
             width: 250px; text-align: center;">
  <h1 style="font-size: 21px; color: #000080; margin: auto;">  হোল্ডিং তথ্য
  </h1>
</div>



            

            <table>

             <tr>
    <td style="width: 30%;font-size:18px;font-weight:bold;">হোল্ডিং নম্বর</td>
    <td style="margin-left:20px;font-size:18px;font-weight:bold;">: ${
      enToBnNumber(cert.holdingNo)
    }</td>
  </tr>
  <tr>
    <td style="width: 30%;font-size:18px;font-weight:bold;">নাম</td>
    <td style="margin-left:20px;font-size:18px;font-weight:bold;">: ${
      cert.headName
    }</td>
  </tr>
    
  <tr>
    <td>পিতার নাম</td>
    <td>: ${cert.father || "-"}</td>
    </tr>
    <tr>
    <td>মাতার নাম</td>
    <td>: ${cert.mother || "-"}</td>
  </tr>

  <tr>
    <td>ধর্ম</td>
    <td>: ${cert.religion || "-"}</td>
  </tr>
<tr>
    <td>মোবাইল</td>
    <td>: ${enToBnNumber(cert.mobile) || "-"}</td>
  </tr>

    <tr>
    <td>জাতীয় পরিচয়পত্রের নম্বর</td>
    <td>: ${enToBnNumber(cert.nid) || "-"}</td>
  </tr>

  <tr>
    <td>জন্ম তারিখ</td>
    <td>: ${bnDob}</td>
  </tr>
   
    <tr>
    <td>ওয়ার্ড</td>
    <td>: ${enToBnNumber(cert.ward) || "-"}</td>
  </tr>
   
  <tr>
    <td>ঠিকানা</td>
    <td>: ${cert.address || "-"}</td>
  </tr>

   
</table>
 
 <br>
        

             ${signatureHTML}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

    openPrintWindow(printContents);
  }
  catch (error) {
    console.error("Printing failed:", error);
    toast.error("Printing failed");
  } finally {
    setIsLoading(false); // ⬅️ লোডিং বন্ধ
  }

  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/holding?id=${editingId}` : "/api/holding";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Updated!" : "Saved!");
        setForm({
          headName: "",
          ward: "1",
          holdingNo: "",
          father: "",
          mother: "",
          nid: "",
          mobile: "",
          dob: "",
          gender: "MALE",
          religion: "ISLAM",
          comments: "",
          rawRoom: "",
          occupation: "",
          maleMembers: "",
          femaleMembers: "",
          othersMembers: "",
          maleBaby: "",
          femaleBaby: "",
          othersBaby: "",
          address: "",
          area: "",
          multiStoriedRoom: "",
          buildingRoom: "",
          semiBuildingRoom: "",
          ownHouseRent: "",
          othersRent: "",
          imposedTax: "",
        });
        setEditingId(null);
        fetchHoldings();
      } else {
            toast.error(data.error || "failed");

      }
    } catch (err) {
      toast.error("Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm delete?")) return;
    try {
      const res = await fetch(`/api/holding?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted");
        fetchHoldings();
      }
    } catch (err) {
      toast.error("Delete Error");
    }
  };

  const handleEdit = (h) => {
    setForm({ ...h, dob: h.dob?.substring(0, 10) }); // format dob
    setEditingId(h.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 p-6 sm:p-8 rounded-2xl shadow-lg mb-8 transition-shadow duration-300 hover:shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-darkcyan">
          {editingId ? "✏️ আপডেট হোল্ডিং" : "📝 নতুন হোল্ডিং"}{" "}
          <span className="text-red-600 text-base font-normal">
            (সকল সংখ্যা ইংরেজিতে পূরণ করুন) একটি হোল্ডিং শুধু একবার এন্ট্রি হবে।
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* মালিকের নাম */}
          <div>
            <label
              htmlFor="headName"
              className="block mb-2 font-semibold text-darkcyan"
            >
              মালিকের নাম <span className="text-red-600">*</span>
            </label>
            <input
              id="headName"
              placeholder="মালিকের নাম"
              value={form.headName}
              onChange={(e) => setForm({ ...form, headName: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
              required
            />
          </div>

          {/* ওয়ার্ড */}
          <div>
            <label
              htmlFor="ward"
              className="block mb-2 font-semibold text-darkcyan"
            >
              ওয়ার্ড <span className="text-red-600">*</span>
            </label>
           <select
              id="ward"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
               
            </select>
          </div>

          {/* পিতা */}
          <div>
            <label
              htmlFor="father"
              className="block mb-2 font-semibold text-darkcyan"
            >
              পিতা <span className="text-red-600">*</span>
            </label>
            <input
              id="father"
              placeholder="পিতা"
              value={form.father}
              onChange={(e) => setForm({ ...form, father: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
              required
            />
          </div>

          {/* মাতা */}
          <div>
            <label
              htmlFor="mother"
              className="block mb-2 font-semibold text-darkcyan"
            >
              মাতা <span className="text-red-600">*</span>
            </label>
            <input
              id="mother"
              placeholder="মাতা"
              value={form.mother}
              onChange={(e) => setForm({ ...form, mother: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
              required
            />
          </div>

          {/* জন্ম তারিখ */}
          <div>
            <label
              htmlFor="dob"
              className="block mb-2 font-semibold text-darkcyan"
            >
              জন্ম তারিখ<span className="text-red-600">*</span>
            </label>

            <DatePicker
  id="dob"
  selected={form.dob ? new Date(form.dob) : null}
  onChange={(date) =>
    setForm({
      ...form,
      dob: date
        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0]
        : "",
    })
  }
  dateFormat="yyyy-MM-dd"
  placeholderText="জন্ম তারিখ নির্বাচন করুন"
  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
  required
/>

            
          </div>

          {/* লিঙ্গ */}
          <div>
            <label
              htmlFor="gender"
              className="block mb-2 font-semibold text-darkcyan"
            >
              লিঙ্গ
            </label>
            <select
              id="gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            >
              <option value="MALE">পুরুষ</option>
              <option value="FEMALE">মহিলা</option>
              <option value="OTHER">অন্যান্য</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="religion"
              className="block mb-2 font-semibold text-darkcyan"
            >
              ধর্ম
            </label>
            <select
              id="religion"
              value={form.religion}
              onChange={(e) => setForm({ ...form, religion: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            >
              <option value="ISLAM">ইসলাম</option>
              <option value="HINDU">হিন্দু</option>
              <option value="CHRISTIAN">খ্রিস্টান</option>
              <option value="BUDDHIST">বৌদ্ধ</option>
              <option value="OTHER">অন্যান্য</option>
            </select>
          </div>

          {/* পেশা */}
          <div>
            <label
              htmlFor="occupation"
              className="block mb-2 font-semibold text-darkcyan"
            >
              পেশা
            </label>
            <input
              id="occupation"
              placeholder="পেশা"
              value={form.occupation}
              onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* হোল্ডিং নং */}
          <div>
            <label
              htmlFor="holdingNo"
              className="block mb-2 font-semibold text-darkcyan"
            >
              হোল্ডিং নং <span className="text-red-600">*</span>
            </label>
            <input
              id="holdingNo"
              placeholder="হোল্ডিং নং"
              value={form.holdingNo}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) setForm({ ...form, holdingNo: value });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
              required
            />
          </div>

          {/* NID */}
          <div>
            <label
              htmlFor="nid"
              className="block mb-2 font-semibold text-darkcyan"
            >
              NID <span className="text-red-600">(*ইংরেজি সংখ্যা)</span>
            </label>
            <input
              id="nid"
              placeholder="NID"
              value={form.nid}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value)) setForm({ ...form, nid: value });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
              required
            />
          </div>

          {/* মোবাইল */}
          <div>
            <label
              htmlFor="mobile"
              className="block mb-2 font-semibold text-darkcyan"
            >
              মোবাইল
            </label>
            <input
              id="mobile"
              placeholder="মোবাইল"
              value={form.mobile}
             onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value)) setForm({ ...form, mobile: value });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* পুরুষ সদস্য */}
          <div>
            <label
              htmlFor="maleMembers"
              className="block mb-2 font-semibold text-darkcyan"
            >
              পুরুষ সদস্য
            </label>
            <input
              id="maleMembers"
              
              placeholder="পুরুষ সদস্য"
              value={form.maleMembers}
              onChange={(e) =>
                setForm({ ...form, maleMembers: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* মহিলা সদস্য */}
          <div>
            <label
              htmlFor="femaleMembers"
              className="block mb-2 font-semibold text-darkcyan"
            >
              মহিলা সদস্য
            </label>
            <input
              id="femaleMembers"
              
              placeholder="মহিলা সদস্য"
              value={form.femaleMembers}
              onChange={(e) =>
                setForm({ ...form, femaleMembers: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* অন্যান্য সদস্য */}
          <div>
            <label
              htmlFor="othersMembers"
              className="block mb-2 font-semibold text-darkcyan"
            >
              অন্যান্য সদস্য
            </label>
            <input
              id="othersMembers"
              
              placeholder="অন্যান্য সদস্য"
              value={form.othersMembers}
              onChange={(e) =>
                setForm({ ...form, othersMembers: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* পুরুষ শিশু */}
          <div>
            <label
              htmlFor="maleBaby"
              className="block mb-2 font-semibold text-darkcyan"
            >
              পুরুষ শিশু
            </label>
            <input
              id="maleBaby"
              
              placeholder="পুরুষ শিশু"
              value={form.maleBaby}
              onChange={(e) => setForm({ ...form, maleBaby: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* মহিলা শিশু */}
          <div>
            <label
              htmlFor="femaleBaby"
              className="block mb-2 font-semibold text-darkcyan"
            >
              মহিলা শিশু
            </label>
            <input
              id="femaleBaby"
              
              placeholder="মহিলা শিশু"
              value={form.femaleBaby}
              onChange={(e) =>
                setForm({ ...form, femaleBaby: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* অন্যান্য শিশু */}
          <div>
            <label
              htmlFor="othersBaby"
              className="block mb-2 font-semibold text-darkcyan"
            >
              অন্যান্য শিশু
            </label>
            <input
              id="othersBaby"
              
              placeholder="অন্যান্য শিশু"
              value={form.othersBaby}
              onChange={(e) =>
                setForm({ ...form, othersBaby: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* ঠিকানা */}
          <div>
            <label
              htmlFor="address"
              className="block mb-2 font-semibold text-darkcyan"
            >
              ঠিকানা <span className="text-red-600">*</span>
            </label>
            <input
              id="address"
              placeholder="ঠিকানা"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
              required
            />
          </div>

          {/* বর্গফুট */}
          <div>
            <label
              htmlFor="area"
              className="block mb-2 font-semibold text-darkcyan"
            >
              বর্গফুট
            </label>
            <input
              id="area"
              placeholder="বর্গফুট"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* বহুতল কক্ষ */}
          <div>
            <label
              htmlFor="multiStoriedRoom"
              className="block mb-2 font-semibold text-darkcyan"
            >
              বহুতল কক্ষ
            </label>
            <input
              id="multiStoriedRoom"
              
              placeholder="বহুতল কক্ষ"
              value={form.multiStoriedRoom}
              onChange={(e) =>
                setForm({ ...form, multiStoriedRoom: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* পাকা ঘরের কক্ষ */}
          <div>
            <label
              htmlFor="buildingRoom"
              className="block mb-2 font-semibold text-darkcyan"
            >
              পাকা ঘরের কক্ষ
            </label>
            <input
              id="buildingRoom"
              
              placeholder="পাকা ঘরের কক্ষ"
              value={form.buildingRoom}
              onChange={(e) =>
                setForm({ ...form, buildingRoom: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* সেমি পাকা ঘরের কক্ষ */}
          <div>
            <label
              htmlFor="semiBuildingRoom"
              className="block mb-2 font-semibold text-darkcyan"
            >
              সেমি পাকা ঘরের কক্ষ
            </label>
            <input
              id="semiBuildingRoom"
              
              placeholder="সেমি পাকা ঘরের কক্ষ"
              value={form.semiBuildingRoom}
              onChange={(e) =>
                setForm({ ...form, semiBuildingRoom: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* কাঁচা ঘরের কক্ষ */}
          <div>
            <label
              htmlFor="semiBuildingRoom"
              className="block mb-2 font-semibold text-darkcyan"
            >
              কাঁচা ঘরের কক্ষ
            </label>
            <input
              id="rawRoom"
              type="text"
              placeholder="কাঁচা ঘরের কক্ষ"
              value={form.rawRoom}
              onChange={(e) => setForm({ ...form, rawRoom: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* নিজস্ব ভাড়া (নিজে বসবাস) */}
          <div>
            <label
              htmlFor="ownHouseRent"
              className="block mb-2 font-semibold text-darkcyan"
            >
              নিজস্ব ভাড়া (নিজে বসবাস)
            </label>
            <input
              id="ownHouseRent"
              
              placeholder="নিজস্ব ভাড়া (নিজে বসবাস)"
              value={form.ownHouseRent}
              onChange={(e) =>
                setForm({ ...form, ownHouseRent: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* অন্যান্য ভাড়া */}
          <div>
            <label
              htmlFor="othersRent"
              className="block mb-2 font-semibold text-darkcyan"
            >
              অন্যান্য ভাড়া
            </label>
            <input
              id="othersRent"
              
              placeholder="অন্যান্য ভাড়া"
              value={form.othersRent}
              onChange={(e) =>
                setForm({ ...form, othersRent: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          {/* ধার্যকৃত কর */}
          <div>
            <label
              htmlFor="imposedTax"
              className="block mb-2 font-semibold text-darkcyan"
            >
              ধার্যকৃত কর
            </label>
            <input
              id="imposedTax"
              
              placeholder="ধার্যকৃত কর"
              value={form.imposedTax}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value))
                  setForm({ ...form, imposedTax: value });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            />
          </div>

          <div>
            <label
              htmlFor="comments"
              className="block mb-2 font-semibold text-darkcyan"
            >
              মন্তব্য
            </label>
            <textarea
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`mt-8 w-full font-bold py-3 rounded-xl shadow-lg transition-colors duration-300
    ${
      isSaving
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-teal-600 hover:to-cyan-600 text-white"
    }
  `}
        >
          {isSaving
            ? editingId
              ? "⏳ আপডেট হচ্ছে..."
              : "⏳ সংরক্ষণ হচ্ছে..."
            : editingId
            ? "✅ আপডেট করুন"
            : "✅ সংরক্ষণ করুন"}
        </button>
      </form>

      {/* টেবিল */}
      <div className="bg-white border p-4 rounded-xl shadow relative">
  {isLoading ? (
    <div className="absolute inset-0 bg-white bg-opacity-70 z-50 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-red-600 text-sm mt-2">লোড হচ্ছে...</p>
    </div>
  ) : (
    <>
      <h2 className="text-xl font-semibold mb-3">📋 হোল্ডিং তালিকা</h2>
      <table className="w-full text-sm border">
        <thead className="bg-blue-100">
          <tr>
            <th className="border p-2">নাম</th>
            <th className="border p-2">ওয়ার্ড</th>
            <th className="border p-2">হোল্ডিং</th>
            <th className="border p-2">মোবাইল</th>
            <th className="border p-2">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.id}>
              <td className="border p-2">{h.headName}</td>
              <td className="border p-2">{h.ward}</td>
              <td className="border p-2">{h.holdingNo}</td>
              <td className="border p-2">{h.mobile}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(h)}
                  className="text-blue-600 mr-2 text-xl"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="text-red-600 text-xl"
                >
                  🗑
                </button>
                <button
                  onClick={() => handlePrint(h)}
                  className="text-green-600 text-xl"
                >
                  🖨️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )}
</div>


      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
}
