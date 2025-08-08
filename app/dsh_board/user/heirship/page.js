'use client'
import { Pencil } from "lucide-react"; // Lucide icon ব্যবহার করলে

import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
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


export default function HeirshipPage() {
    const today = new Date().toISOString().split("T")[0];
    const [isDisabled, setIsDisabled] = useState(true);

    function parseDateSafe(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date; // ভ্যালিড হলে Date, নাহলে null
}


  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    nidOrBirth: '',
    presentAddress: '',
    permanentAddress: '',
    applicantName: '',
    applicantAddress: '',
    notes: 'তিনি অত্র ইউনিয়নের একজন স্থায়ী বাসিন্দা ছিলেন। মৃত্যুকালে তিনি নিম্নলিখিত ওয়ারিশগণ রাখিয়া গিয়েছেন।',
    letter_count: '',
    issuedDate: today,
  })

  const [children, setChildren] = useState([
    {
      name: '',
      fatherOrHusbandName: '',
      village: '',
      dob: '',
      nidOrBirth: '',
      relation: '',
            notes: ''
    }
  ])

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const fetchData = async () => {
  setLoading(true)
  try {
    const res = await fetch('/api/heirship')
    const json = await res.json()
    console.log('Fetch data response:', json)
    if (json.success && Array.isArray(json.records)) {
      setData(json.records)
    } else {
      toast.error('সঠিক ফরম্যাটে ডাটা পাওয়া যায়নি')
    }
  } catch (e) {
    toast.error('ডাটা লোডিং এ সমস্যা হয়েছে')
  } finally {
    setLoading(false)
  }
}

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


const formatDate = (date) => {
    const data = date?.substring(0, 10).split("-");
    return `${data[2]}-${data[1]}-${data[0]}`;
    if (!date || date.length !== 8) return date; // 8 digit হলে মনে করব yyyymmdd
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    fetchData()
    fetchOfficeSettings()
    fetchEmployees()

    if (!form.issuedDate) {
      setForm(prev => ({ ...prev, issuedDate: today }));
    }
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.fatherName || !form.motherName) return alert('ফর্ম পূরণ করুন')

    setLoading(true)
    const payload = {
      ...form,
      children: children.map(child => ({
        name: child.name || '',
        fatherOrHusbandName: child.fatherOrHusbandName || '',
        village: child.village || '',
        dob: child.dob ? new Date(child.dob).toISOString() : null,
  nidOrBirth: child.nidOrBirth || '',
        relation: child.relation || '',
       age:'0',
        notes: child.notes || '',
      }))
    }

    try {
      const res = await fetch(`/api/heirship${editingId ? '?id=' + editingId : ''}`, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        toast.success("saved!!")
        fetchData()
        resetForm()
      } else {
        toast.error('ডেটা সেভ হয়নি: ' + (json.error || 'অজানা সমস্যা'))
      }
    } catch (error) {
      toast.error('সার্ভারে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      fatherName: '',
      motherName: '',
      nidOrBirth: '',
      presentAddress: '',
      permanentAddress: '',
      notes: 'তিনি অত্র ইউনিয়নের একজন স্থায়ী বাসিন্দা ছিলেন। মৃত্যুকালে তিনি নিম্নলিখিত ওয়ারিশগণ রাখিয়া গিয়েছেন।',
      applicantName: '',
      letter_count:'',
      applicantAddress: '',
      issuedDate:today,
    })
    setChildren([{ name: '', fatherOrHusbandName: '', village: '', relation: '',  notes: '', dob: '', nidOrBirth: '' }])
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি মুছে ফেলতে চান?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/heirship?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (res.ok && json.success) {
        toast.success("deleted!")
        fetchData()
      } else {
        toast.error('ডেটা মুছতে সমস্যা হয়েছে: ' + (json.error || 'অজানা সমস্যা'))
      }
    } catch {
      toast.error('ডিলিটে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const fetchCertById = async (id) => {
  try {
    const res = await fetch(`/api/heirship?id=${id}`);
    const json = await res.json();
    if (json.success) {
      return json.record; // এতে children সহ সব থাকবে
    } else {
      throw new Error(json.error || 'ডাটা পাওয়া যায়নি');
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};


  const handlePrint = async (cert) => {
  setLoading(true);
  try {
    const origin = window.location.origin;
    const nid = enToBnNumber(cert.nidOrBirth);

    const issue_date_format = formatDate(cert.issuedDate || new Date());
   
    const [issue_day, issue_month, issue_year] = issue_date_format.split("-");
    const bnIssueDate = `${enToBnNumber(issue_day)}-${enToBnNumber(issue_month)}-${enToBnNumber(issue_year)}`;

    const govtImg = `${origin}/images/govt.png`;
    const unionImg = settings?.imageUrl || `${origin}/images/union.png`;

    const qrUrl = `${origin}/verify/heirship?id=${cert.id}`;
    const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=100x100`;

    await Promise.all([preloadImage(govtImg), preloadImage(unionImg)]).catch(console.error);
    const type2="নাগরিকত্ব সনদ";

    let signatureHTML = generateSignatureHTML(
      signer,
      signer2,
      designationText,
      designationText2,
      settings,
      qrImg_with_link,
      type2,
    );
    
   signatureHTML = signatureHTML.replace(
  /<img[^>]*>/gi,
  '<h2 style="    ">&nbsp;</h2>'
);


    const headerHTML = getHeaderSection(settings, govtImg, unionImg);

    // children table rows generate
    const childrenRows = cert.children && cert.children.length > 0
      ? cert.children.map( (child,index) => `
          <tr>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${enToBnNumber(index+1)}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.name || ''}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.fatherOrHusbandName || ''}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.nidOrBirth || ''}</td>
            
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">  ${ enToBnNumber( formatDate(child.dob || new Date()))}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.relation || ''}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.notes || ''}</td>
          </tr>`).join('')
      : `<tr><td colspan="6" style="text-align:center; padding:10px;">কোনো সন্তানের তথ্য নেই</td></tr>`;

    const printContents = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>${cert.type || "Certificate"}</title>
        <style>
          ${commonPrintStyles.replace("__UNION_IMG__", unionImg)}
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 14px;
          }
          th {
            background-color: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <div class="outer-border">
          <div class="middle-border">
            <div class="inner-border">

              ${headerHTML}
              <hr />
              <div class="top-section">
                <p>স্মারক নং: ${settings?.sarok_no}${enToBnNumber(cert?.letter_count)}</p>
                <p>তারিখ: ${bnIssueDate}</p>
              </div>

              <div style="border: 1px solid green; margin:auto; background-color: #e6f4ea; padding: 5px; margin-top: 1px; border-radius: 7px; width: 250px; text-align: center;">
                <h1 style="font-size: 19px; color: #000080; margin: auto;">
                  ${cert.type || "ওয়ারিশ সনদ"}
                </h1>
              </div>

              <p style="margin-top:-5px;"><b>প্রত্যয়ন করা যাচ্ছে যে,</b></p>
<table border="0" style="border-collapse: collapse; border: 0;margin-top:-10px; width: 100%;">
  <tr>
    <td style="width: 20%; font-weight: bold; border: 0; ">নাম:</td>
    <td style="width: 30%;border: 0; "> ${cert.name}
    </td>  <td style="  font-weight: bold; border: 0; font-size:13px;">জাতীয় পরিচয়পত্র/জন্ম নিবন্ধন: ${cert.nidOrBirth}</td>
  </tr>
  <tr>
    <td style="width: 20%; font-weight: bold; border: 0; ">পিতার নাম:</td>
    <td style="width: 30%;border: 0; "> ${cert.fatherName}</td>
     <td style="width: 50%; font-weight: bold; border: 0; ">মাতার নাম: &nbsp; ${cert.motherName}</td>
    
  </tr>
   
   
  <tr ‍style="font-size:11px;">
    <td style="width: 20%; font-weight: bold; border: 0; ">বর্তমান ঠিকানা:</td>
    <td style="width: 30%;border: 0; font-size:11px;"> ${cert.presentAddress}</td>
    <td style=" border: 0; font-size:11px;"><b>স্থায়ী ঠিকানা:</b> &nbsp;${cert.permanentAddress}</td>
  </tr>

 

  <tr ‍style="font-size:11px;">
    <td style="width: 20%; font-weight: bold; border: 0; ">আবেদনকারীর নাম</td>
    <td style="width: 30%;border: 0; "> ${cert.applicantName}</td>
    <td style=" border: 0;font-size:11px; "><b>আবেদনকারীর ঠিকানা:</b> &nbsp;${cert.applicantAddress}</td>
  </tr>
   <tr ‍style="font-size:10px;">
    <td colspan=3 style="width: 100%; font-weight: bold; border: 0; ">${cert.notes}</td>
   
  </tr>
   
</table>


              
              <table style="font-size:14px;margin-top:-8px;">
                <thead>
                <tr>
                <th colspan=7>ওয়ারিশগণের তথ্য</th>

                </tr>
                  <tr>
                    <th>ক্রম</th>
                    <th>নাম</th>
                    <th>পিতা/স্বামী</th>
                    <th>এনআইডি/জন্ম নিবন্ধন</th>
                    
                    <th>জন্ম তারিখ</th>
                    <th>সম্পর্ক</th>
                    <th>মন্তব্য</th>
                  </tr>
                </thead>
                <tbody>
                  ${childrenRows}
                </tbody>
              </table>
              <div>
              <h6><b>
              সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, উল্লিখিত ব্যক্তিগণ ব্যতীত তাঁর আর কোনো ওয়ারিশ নেই। </b></p>

              </h6>

              </div>
               

              ${signatureHTML}

            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    openPrintWindow(printContents);
  } catch (error) {
    console.error("Printing failed:", error);
    toast.error("Printing failed");
  } finally {
    setLoading(false);
  }
};



  const handleEdit = (item) => {
    setForm({
      name: item.name,
      fatherName: item.fatherName,
      motherName: item.motherName,
      nidOrBirth: item.nidOrBirth,
      presentAddress: item.presentAddress,
      permanentAddress: item.permanentAddress,
      applicantName: item.applicantName,
      applicantAddress: item.applicantAddress,
      notes: item.notes || 'তিনি অত্র ইউনিয়নের একজন স্থায়ী বাসিন্দা ছিলেন। মৃত্যুকালে তিনি নিম্নলিখিত ওয়ারিশগণ রাখিয়া গিয়েছেন।',
      issuedDate: item.issuedDate,
    })
    setChildren(item.children)
    setEditingId(item.id)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">ওয়ারিশন সনদ ফর্ম</h1>

     <form onSubmit={handleSubmit} className="space-y-8 p-8 rounded-2xl bg-white shadow-xl border border-gray-200">
  {/* সনদের নাম্বার */}
  <div>
    <label className=" relative  block font-semibold text-sm  mb-2 text-red-500">
      সনদের নাম্বার (শুধু প্রথমটির জন্য অবশ্যই ইংরেজি নাম্বার) (ইনপুট দেয়ার জন্য পাশের বাটনে ক্লিক করুন)
    </label>
    <input
      type="text"
       disabled={isDisabled}
      value={form.letter_count ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          setForm({ ...form, letter_count: value });
        }
      }}
      placeholder="example: 357"
      className="max-w-56 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
    />

     {/* Edit Icon */}
      <button
        type="button"
        onClick={() => setIsDisabled(false)}
        className="absolute ml-4 bg-[darkcyan] p-2 shadow-2xl rounded-2xl   text-[whitesmoke] hover:bg-[green] hover:text-[white]"
      >
        <Pencil size={22} />click here for serial entry
      </button>


  </div>

  {/* Personal Info */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      { id: 'name', label: 'নাম', value: form.name, required: true },
      { id: 'fatherName', label: 'পিতার নাম', value: form.fatherName, required: true },
      { id: 'motherName', label: 'মাতার নাম', value: form.motherName, required: true },
      { id: 'nidOrBirth', label: 'এনআইডি/জন্ম নিবন্ধন', value: form.nidOrBirth, required: true },
      { id: 'presentAddress', label: 'বর্তমান ঠিকানা', value: form.presentAddress },
      { id: 'permanentAddress', label: 'স্থায়ী ঠিকানা', value: form.permanentAddress },
      { id: 'applicantName', label: 'আবেদনকারীর নাম', value: form.applicantName, required: true },
      { id: 'applicantAddress', label: 'আবেদনকারীর ঠিকানা', value: form.applicantAddress },
    ].map(({ id, label, value, required }) => (
      <div key={id}>
        <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <input
          id={id}
          type="text"
          placeholder={label}
          value={value}
          onChange={(e) => setForm({ ...form, [id]: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          required={required}
        />
      </div>
    ))}
    <div>
      <label htmlFor="issuedDate" className="block mb-1 font-medium text-gray-700">ইস্যুর তারিখ</label>
      <DatePicker
        id="issuedDate"
        selected={form.issuedDate ? new Date(form.issuedDate) : null}
        onChange={(date) =>
          setForm({ ...form, issuedDate: date?.toISOString().split("T")[0] || '' })
        }

        
        dateFormat="yyyy-MM-dd"
        placeholderText="তারিখ নির্বাচন করুন"
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
    </div>

    <div className="md:col-span-2">
  <label htmlFor="notes" className="block mb-1 font-medium text-gray-700">
    মন্তব্য / নোট
  </label>
  <textarea
    id="notes"
    placeholder="যে কোনো মন্তব্য বা নোট লিখুন..."
    value={form.notes}
    onChange={(e) => setForm({ ...form, notes: e.target.value })}
    rows={4}
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
  ></textarea>
</div>

  </div>

  {/* Children Info */}
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-700">সন্তানদের তথ্য</h2>
    {children.map((child, idx) => (
      <div key={idx} className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 items-end p-4 border rounded-lg bg-gray-50">
        {[
          { key: 'name', label: 'নাম', required: true },
          { key: 'fatherOrHusbandName', label: 'পিতা/স্বামীর নাম' },
          { key: 'nidOrBirth', label: 'NID/Birth No', required: true },
          { key: 'village', label: 'গ্রাম' },
          { key: 'relation', label: 'সম্পর্ক' },
          { key: 'notes', label: 'মন্তব্য' },
        ].map(({ key, label, required }) => (
          <div key={key}>
            <label className="block text-sm text-[blueviolet] mb-1">{label} {required && <span className="text-red-600">*</span>}</label>
            <input
              type="text"
              placeholder={label}
              value={child[key]}
              onChange={(e) => {
                const updated = [...children];
                updated[idx][key] = e.target.value;
                setChildren(updated);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required={required}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm text-[blueviolet] mb-1">জন্ম তারিখ</label>

          

           <DatePicker
  required
  selected={parseDateSafe(child.dob)}
  onChange={(date) => {
    const updated = [...children];
    updated[idx].dob = date
      ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : '';
    setChildren(updated);
  }}
  dateFormat="yyyy-MM-dd"
  placeholderText="তারিখ নির্বাচন করুন"
  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
/>
        </div>

        <div className="flex items-center justify-center">
          {children.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const updated = [...children];
                updated.splice(idx, 1);
                setChildren(updated);
              }}
              className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    ))}

    <button
      type="button"
      onClick={() => setChildren([...children, { name: '', fatherOrHusbandName: '', village: '', relation: '', notes: '', dob: '', nidOrBirth: '' }])}
      className="text-green-600 hover:text-green-800 text-sm font-semibold px-4 py-2 border border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition"
    >
      + Add Child
    </button>
  </div>

  <div className="pt-6">
    <button
      type="submit"
      disabled={loading}
      className={`w-full md:w-auto px-6 py-3 rounded-lg text-white text-lg font-semibold shadow-md transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
    >
      {loading ? (editingId ? 'আপডেট হচ্ছে...' : 'সেভ হচ্ছে...') : (editingId ? 'আপডেট করুন' : 'সংরক্ষণ করুন')}
    </button>
  </div>
</form>

      <hr className="my-8" />

      <h2 className="text-xl font-bold mb-4">তালিকা</h2>
      {loading ? (
        <div className="flex items-center gap-2 text-green-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          <p>লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2">নাম</th>
                <th className="border px-2">পিতা</th>
                <th className="border px-2">আবেদনকারী</th>
                <th className="border px-2">একশন</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td className="border px-2 text-center" colSpan="4">কোনো তথ্য নেই</td>
                </tr>
              )}
              {data.map((d) => (
                <tr key={d.id}>
                  <td className="border px-2">{d.name}</td>
                  <td className="border px-2">{d.fatherName}</td>
                  <td className="border px-2">{d.applicantName}</td>
                  <td className="border px-2 space-x-2">
                    <button
                      onClick={() => handleEdit(d)}
                      disabled={loading}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      disabled={loading}
                      className="text-red-600 hover:underline"
                    >
                      🗑
                    </button>

                     <button
                    onClick={() => handlePrint(d)}
                    className="text-green-600"
                  >
                    🖨️
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        <ToastContainer position="top-center" autoClose={2000} />
    </div>
  )
}