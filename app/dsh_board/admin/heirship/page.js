'use client'

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

  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    nidOrBirth: '',
    presentAddress: '',
    permanentAddress: '',
    applicantName: '',
    applicantAddress: '',
    letter_count: '',
    issuedDate: today,
  })

  const [children, setChildren] = useState([
    {
      name: '',
      fatherOrHusbandName: '',
      village: '',
      relation: '',
      age: '',
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
        relation: child.relation || '',
        age: child.age || '',
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
      applicantName: '',
      letter_count:'',
      applicantAddress: '',
      issuedDate:today,
    })
    setChildren([{ name: '', fatherOrHusbandName: '', village: '', relation: '', age: '', notes: '' }])
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

    const signatureHTML = generateSignatureHTML(
      signer,
      signer2,
      designationText,
      designationText2,
      settings,
      qrImg_with_link,
      type2,
    );

    const headerHTML = getHeaderSection(settings, govtImg, unionImg);

    // children table rows generate
    const childrenRows = cert.children && cert.children.length > 0
      ? cert.children.map(child => `
          <tr>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.name || ''}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.fatherOrHusbandName || ''}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.village || ''}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.relation || ''}</td>
            <td style="border:1px solid #000; padding:2px;font-size:14px;text-align:center;">${child.age || ''}</td>
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

              <p><b>প্রত্যয়ন করা যাচ্ছে যে,</b></p>
<table border="0" style="border-collapse: collapse; border: 0;margin-top:-10px; width: 100%;">
  <tr>
    <td style="width: 25%; font-weight: bold; border: 0; padding: 4px;">নাম:</td>
    <td style="width: 25%;border: 0; padding: 4px;"> ${cert.name}
    </td>  <td style="width: 50%; font-weight: bold; border: 0; padding: 4px;">জাতীয় পরিচয়পত্র/জন্ম নিবন্ধন: ${cert.nidOrBirth}</td>
  </tr>
  <tr>
    <td style="width: 25%; font-weight: bold; border: 0; padding: 4px;">পিতার নাম:</td>
    <td style="width: 25%;border: 0; padding: 4px;"> ${cert.fatherName}</td>
     <td style="width: 50%; font-weight: bold; border: 0; padding: 4px;">মাতার নাম: &nbsp; ${cert.motherName}</td>
    
  </tr>
   
   
  <tr ‍style="font-size:11px;">
    <td style="width: 25%; font-weight: bold; border: 0; padding: 4px;">বর্তমান ঠিকানা:</td>
    <td style="width: 25%;border: 0; padding: 4px;"> ${cert.presentAddress}</td>
    <td style="width: 50%;border: 0; padding: 4px;">স্থায়ী ঠিকানা: &nbsp;${cert.permanentAddress}</td>
  </tr>
   
</table>


              <h3 style="margin-top: 1px;">ওয়ারিশগণের তথ্য</h3>
              <table style="font-size:14px;margin-top:-5px;">
                <thead>
                  <tr>
                    <th>নাম</th>
                    <th>পিতা/স্বামী</th>
                    <th>গ্রাম</th>
                    <th>সম্পর্ক</th>
                    <th>বয়স</th>
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
              <br>

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
      issuedDate: item.issuedDate,
    })
    setChildren(item.children)
    setEditingId(item.id)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">ওয়ারিশন সনদ ফর্ম</h1>

      <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-white shadow">
        {/* Personal Info */}

        <div>
            <label className="font-semibold  text-red-500">
              সনদের নাম্বার (শুধু প্রথমটির জন্য অবশ্যই ইংরেজি নাম্বার) (যদি
              প্রথমটির জন্য ইনপুট দিতে ভুলে যান তবে ডেটা আপডেট না করে আবার ফরম
              পূরণ করে সেভ দিন, আপডেটে এই ফিল্ড কাজ করবে না)
            </label>
            <input
              type="text"
              value={form.letter_count ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                // ✅ শুধুমাত্র ইংরেজি সংখ্যা (0-9) অনুমোদিত
                if (/^\d*$/.test(value)) {
                  setForm({ ...form, letter_count: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="example: 357"
            />
          </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">নাম <span className="text-red-600">*</span></label>
            <input
              id="name"
              type="text"
              placeholder="নাম"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="fatherName" className="block mb-1 font-medium">পিতার নাম <span className="text-red-600">*</span></label>
            <input
              id="fatherName"
              type="text"
              placeholder="পিতার নাম"
              value={form.fatherName}
              onChange={e => setForm({ ...form, fatherName: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="motherName" className="block mb-1 font-medium">মাতার নাম</label>
            <input
              id="motherName"
              type="text"
              placeholder="মাতার নাম"
              value={form.motherName}
              onChange={e => setForm({ ...form, motherName: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="nidOrBirth" className="block mb-1 font-medium">এনআইডি/জন্ম নিবন্ধন<span className="text-red-600">*</span></label>
            <input
              id="nidOrBirth"
              type="text"
              placeholder="এনআইডি/জন্ম নিবন্ধন"
              value={form.nidOrBirth}
              onChange={e => setForm({ ...form, nidOrBirth: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="presentAddress" className="block mb-1 font-medium">বর্তমান ঠিকানা</label>
            <input
              id="presentAddress"
              type="text"
              placeholder="বর্তমান ঠিকানা"
              value={form.presentAddress}
              onChange={e => setForm({ ...form, presentAddress: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="permanentAddress" className="block mb-1 font-medium">স্থায়ী ঠিকানা</label>
            <input
              id="permanentAddress"
              type="text"
              placeholder="স্থায়ী ঠিকানা"
              value={form.permanentAddress}
              onChange={e => setForm({ ...form, permanentAddress: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="applicantName" className="block mb-1 font-medium">আবেদনকারীর নাম</label>
            <input
              id="applicantName"
              type="text"
              placeholder="আবেদনকারীর নাম"
              value={form.applicantName}
              onChange={e => setForm({ ...form, applicantName: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="applicantAddress" className="block mb-1 font-medium">আবেদনকারীর ঠিকানা</label>
            <input
              id="applicantAddress"
              type="text"
              placeholder="আবেদনকারীর ঠিকানা"
              value={form.applicantAddress}
              onChange={e => setForm({ ...form, applicantAddress: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="applicantAddress" className="block mb-1 font-medium">ইস্যুর তারিখ</label>
              <DatePicker
              id="issuedDate"
              selected={form.issuedDate ? new Date(form.issuedDate) : null}
              onChange={(date) =>
                setForm({ ...form, issuedDate: date?.toISOString().split("T")[0] || '' })
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="তারিখ নির্বাচন করুন"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
             
          </div>


         

        </div>

        {/* Children Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">সন্তানদের তথ্য</h2>
          {children.map((child, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-4 items-center border rounded p-3 bg-gray-50">
              <div>
                <label htmlFor={`child-name-${idx}`} className="block mb-1 font-medium">নাম <span className="text-red-600">*</span></label>
                <input
                  id={`child-name-${idx}`}
                  type="text"
                  placeholder="নাম"
                  value={child.name}
                  onChange={e => {
                    const c = [...children]
                    c[idx].name = e.target.value
                    setChildren(c)
                  }}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor={`child-fatherOrHusbandName-${idx}`} className="block mb-1 font-medium">পিতা/স্বামীর নাম</label>
                <input
                  id={`child-fatherOrHusbandName-${idx}`}
                  type="text"
                  placeholder="পিতা/স্বামীর নাম"
                  value={child.fatherOrHusbandName}
                  onChange={e => {
                    const c = [...children]
                    c[idx].fatherOrHusbandName = e.target.value
                    setChildren(c)
                  }}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor={`child-village-${idx}`} className="block mb-1 font-medium">গ্রাম</label>
                <input
                  id={`child-village-${idx}`}
                  type="text"
                  placeholder="গ্রাম"
                  value={child.village}
                  onChange={e => {
                    const c = [...children]
                    c[idx].village = e.target.value
                    setChildren(c)
                  }}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor={`child-relation-${idx}`} className="block mb-1 font-medium">সম্পর্ক</label>
                <input
                  id={`child-relation-${idx}`}
                  type="text"
                  placeholder="সম্পর্ক"
                  value={child.relation}
                  onChange={e => {
                    const c = [...children]
                    c[idx].relation = e.target.value
                    setChildren(c)
                  }}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor={`child-age-${idx}`} className="block mb-1 font-medium">বয়স</label>
                <input
                  id={`child-age-${idx}`}
                  type="text"
                  placeholder="বয়স"
                  value={child.age}
                  onChange={e => {
                    const c = [...children]
                    c[idx].age = e.target.value
                    setChildren(c)
                  }}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor={`child-notes-${idx}`} className="block mb-1 font-medium">মন্তব্য</label>
                <input
                  id={`child-notes-${idx}`}
                  type="text"
                  placeholder="মন্তব্য"
                  value={child.notes}
                  onChange={e => {
                    const c = [...children]
                    c[idx].notes = e.target.value
                    setChildren(c)
                  }}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex items-center justify-center">
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const c = [...children]
                      c.splice(idx, 1)
                      setChildren(c)
                    }}
                    className="text-red-600 px-2 py-1 rounded hover:bg-red-100 transition"
                    aria-label="সন্তান মুছুন"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setChildren([...children, {
              name: '', fatherOrHusbandName: '', village: '', relation: '', age: '', notes: ''
            }])}
            className="text-blue-600 border-[green] p-3 text-xl hover:underline"
          > 
            + Add
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 px-4 py-2 rounded text-white w-full md:w-auto ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? (editingId ? 'আপডেট হচ্ছে...' : 'সেভ হচ্ছে...') : (editingId ? 'আপডেট করুন' : 'সংরক্ষণ করুন')}
        </button>
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