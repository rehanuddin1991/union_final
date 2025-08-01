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


export default function HoldingCollectionPage() {
  const today = new Date().toISOString().split("T")[0];
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
const formatPaymentDate = (date) => {
    const data = date?.substring(0, 10).split("-");
    return `${data[2]}-${data[1]}-${data[0]}`;
    if (!date || date.length !== 8) return date; // 8 digit হলে মনে করব yyyymmdd
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${day}-${month}-${year}`;
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
    holdingInformationId: '',
    holdingNumber: '',
    fiscalYear: 'Y2025_2026',
    amount: '',
    currentAmount: '',
    dueAmount: '',
    comments: '',
    paymentDate: '',
  })

  const [collections, setCollections] = useState([])
  const [holdings, setHoldings] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [holdingSearchTerm, setHoldingSearchTerm] = useState('')

  const [loading, setLoading] = useState(false)  // loading state


  const handlePrint = async (cert) => {
    setLoading(true); // ⬅️ লোডিং শুরু
  try {
    const origin = window.location.origin;
    const paymentDate = formatPaymentDate(cert.paymentDate?.substring(0, 10));
    const [day, month, year] = paymentDate.split("-");

    const res = await fetch(`/api/holding-with-collection?id=${cert.id}`);
const json = await res.json();

if (!json.success) {
  toast.error("তথ্য পাওয়া যায়নি!");
  return;
}

const collection = json.data;
const holdingInfo = collection.holdingInformation;

    const bnpaymentDate = `${enToBnNumber(day)}-${enToBnNumber(month)}-${enToBnNumber(
      year
    )}`;

    const st_formt_date=cert.fiscalYear.replace(/^Y/, "");
    const [fiscal_start_year, fiscal_end_year] = st_formt_date.split("_");

    const govtImg = `${origin}/images/govt.png`;
    const unionImg = settings?.imageUrl || `${origin}/images/union.png`;

    const qrImg = `${origin}/images/qr.png`;
    const qrUrl = `${origin}/verify/collections?id=${cert.id}`;
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
  <h1 style="font-size: 21px; color: #000080; margin: auto;">  হোল্ডিং ট্যাক্সের তথ্য
  </h1>
</div>



            

            <table>

            <tr>
    <td style="width: 30%;font-size:18px;font-weight:bold;">ক্রমিক নং:</td>
    <td style="margin-left:20px;font-size:18px;font-weight:bold;">........</td>
  </tr>

  

             <tr>
    <td style="width: 30%;font-size:18px;font-weight:bold;">জমার তারিখ</td>
    <td style="margin-left:20px;font-size:18px; ">: ${
       bnpaymentDate
    }</td>
    <td>  আর্থিক বছর:&nbsp;&nbsp; ${convertToBanglaNumber(
      fiscal_start_year
    )}-${convertToBanglaNumber(
      fiscal_end_year
    )}</td>
     
  </tr>


             <tr>
    <td style="width: 30%;font-size:18px;font-weight:bold;">হোল্ডিং নম্বর</td>
    <td style="margin-left:20px;font-size:18px;font-weight:bold;">: ${enToBnNumber(
      cert.holdingNumber)
    }</td>
  </tr>
  <tr>
    <td style="width: 30%;font-size:18px;font-weight:bold;">নাম</td>
    <td style="margin-left:20px;font-size:18px;font-weight:bold;">: ${
      holdingInfo.headName 
    }</td>
  </tr>
    
  <tr>
    <td>পিতার নাম</td>
    <td>: ${holdingInfo.father || "-"}</td>
    </tr>
    <tr>
    <td>মাতার নাম</td>
    <td>: ${holdingInfo.mother || "-"}</td>
  </tr> 
    <tr>
    <td>জাতীয় পরিচয়পত্র নম্বর</td>
    <td>: ${enToBnNumber( holdingInfo.nid) || "-"}</td>
  </tr> 

  <tr>
    <td>ঠিকানা</td>
    <td>: ${holdingInfo.address || "-"}</td>
  </tr> 


   
<tr>
    <td>চলতি টাকার পরিমাণ</td>
    <td>: ${enToBnNumber(cert.currentAmount) || "-"}</td>
  </tr>

    <tr>
    <td>বকেয়া</td>
    <td>: ${enToBnNumber(cert.dueAmount) || "-"}</td>
  </tr>

  <tr>
    <td>মোট কর</td>
    <td>: ${enToBnNumber(cert.amount)}</td>
  </tr>
   
     
   
   

   
</table>
 
 <br>
 <div><img style="margin-top:10px;margin-left:350px;" src=${qrImg_with_link} class="qr-code" alt="QR Code" />

 </div>
 <div style="margin-top:130px; margin-left: 250px;">
<h2>আদায়কারীর স্বাক্ষর ও তারিখ </h2>
 </div>
        

             
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
    setLoading(false); // ⬅️ লোডিং বন্ধ
  }
  

  };



  const fetchCollections = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/holding_collection')
      const data = await res.json()
      if (data.success) setCollections(data.collections)
      else toast.error('Failed to load collections')
    } catch {
      toast.error('Failed to load collections')
    }
    setLoading(false)
  }

  const fetchHoldings = async () => {
    try {
      const res = await fetch('/api/holding')
      const data = await res.json()
      if (data.success) setHoldings(data.holdings)
      else toast.error('Failed to load holdings')
    } catch {
      toast.error('Failed to load holdings')
    }
  }

  useEffect(() => {
    fetchCollections()
    fetchHoldings()
     if (!form.paymentDate) {
      setForm(prev => ({ ...prev, paymentDate: today }));
    }
  }, [])

  useEffect(() => {
  const current = parseFloat(form.currentAmount) || 0;
  const due = parseFloat(form.dueAmount) || 0;
  const total = current + due;
  setForm(prev => ({ ...prev, amount: total.toString() }));
}, [form.currentAmount, form.dueAmount]);

  const filteredHoldings = holdings.filter(h => {
    const term = holdingSearchTerm.toLowerCase()
    return (
      h.headName.toLowerCase().includes(term) ||
      String(h.ward).includes(term) ||
      h.holdingNo.toLowerCase().includes(term)
    )
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!form.holdingNumber || form.holdingNumber.trim() === "") {
          toast.error("হোল্ডিং অবশ্যই দিতে হবে");
          setLoading(false);
          return;
        }

        if (!form.amount || form.amount.trim() === "") {
          toast.error("মোট টাকার পরিমাণ অবশ্যই দিতে হবে");
          setLoading(false);
          return;
        }


    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `/api/holding_collection?id=${editingId}` : '/api/holding_collection'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(editingId ? 'Updated!' : 'Saved!')
        setForm({
          holdingInformationId: '',
          holdingNumber: '',
          fiscalYear: 'Y2025_2026',
          amount: '',
          currentAmount: '',
          dueAmount: '',
          comments: '',
          paymentDate: today,
        })
        setEditingId(null)
        fetchCollections()
      } else {
        toast.error('Failed')
      }
    } catch (err) {
      toast.error('Error')
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Confirm delete?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/holding_collection?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Deleted')
        fetchCollections()
      }
    } catch {
      toast.error('Failed to delete')
    }
    setLoading(false)
  }

  const handleEdit = (c) => {
    setForm({
      holdingInformationId: c.holdingInformationId,
      holdingNumber: c.holdingNumber,
      fiscalYear: c.fiscalYear,
      amount: c.amount,
      currentAmount: c.currentAmount,
      dueAmount: c.dueAmount,
      comments: c.comments,
      paymentDate: c.paymentDate ? c.paymentDate.substring(0, 10) : '',
    })
    setEditingId(c.id)
  }

   const handleHoldingChange = (e) => {
    const selectedId = +e.target.value;
    const selectedHolding = filteredHoldings.find(h => h.id === selectedId);

    setForm({
      ...form,
      holdingInformationId: selectedId,
      holdingNumber: selectedHolding ? selectedHolding.holdingNo : '',
    });
  };


  return (
    <div className="max-w-5xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 p-6 rounded-xl shadow-md mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {editingId ? '✏️ আপডেট হোল্ডিং কালেকশন' : '📝 নতুন হোল্ডিং কালেকশন'}
        </h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="হোল্ডিং অনুসন্ধান করুন (নাম, ওয়ার্ড, নং)"
          value={holdingSearchTerm}
          onChange={e => setHoldingSearchTerm(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
          <div>
            <label htmlFor="holdingInformationId" className="block mb-1 font-medium text-gray-700">
              হোল্ডিং নির্বাচন করুন
            </label>
            <select
              id="holdingInformationId"
              value={form.holdingInformationId}
              // onChange={e => setForm({ ...form, holdingInformationId: +e.target.value })}
              onChange={handleHoldingChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            >
              <option value="">হোল্ডিং নির্বাচন করুন</option>
              {filteredHoldings.map(h => (
                <option key={h.id} value={h.id}>
                  {h.headName} - ওয়ার্ড {h.ward} - হোল্ডিং নং {h.holdingNo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="holdingNumber" className="block mb-1 font-medium text-gray-700">
              হোল্ডিং নাম্বার<span className="text-red-600 text-xl ">*</span>
            </label>
            <input readOnly disabled
              id="holdingNumber"
              
              value={form.holdingNumber}
              onChange={e => setForm({ ...form, holdingNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="fiscalYear" className="block mb-1 font-medium text-gray-700">
              আর্থিক বছর<span className="text-red-600 text-xl ">*</span>
            </label>
            <select
              id="fiscalYear"
              value={form.fiscalYear}
              onChange={e => setForm({ ...form, fiscalYear: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            >
              <option value="Y2022_2023">২০২২-২০২৩</option>
              <option value="Y2023_2024">২০২৩-২০২৪</option>
              <option value="Y2024_2025">২০২৪-২০২৫</option>
              <option value="Y2025_2026">২০২৫-২০২৬</option>
              <option value="Y2026_2027">২০২৬-২০২৭</option>
              <option value="Y2027_2028">২০২৭-২০২৮</option>
              <option value="Y2028_2029">২০২৮-২০২৯</option>
              <option value="Y2029_2030">২০২৯-২০৩০</option>
            </select>
          </div>

          <div>
            <label htmlFor="currentAmount" className="block mb-1 font-medium text-gray-700">
              চলতি ট্যাক্স<span className="text-red-600 text-xl ">*</span>
            </label>
            <input
              id="currentAmount"
              type="number"
              placeholder="পরিমাণ"
              value={form.currentAmount}
              onChange={e => setForm({ ...form, currentAmount: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="dueAmount" className="block mb-1 font-medium text-gray-700">
              বকেয়া (যদি থাকে)
            </label>
            <input
              id="dueAmount"
              type="number"
              placeholder="পরিমাণ"
              value={form.dueAmount}
              onChange={e => setForm({ ...form, dueAmount: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
               
            />
          </div>

          <div>
            <label htmlFor="amount" className="block mb-1 font-medium text-gray-700">
              মোট টাকা
            </label>
            <input readOnly disabled
              id="amount"
              type="number"
              placeholder="পরিমাণ"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="paymentDate" className="block mb-1 font-medium text-gray-700">
              পেমেন্ট তারিখ<span className="text-red-600 text-xl ">*</span>
            </label>

            <DatePicker
    id="paymentDate"
    selected={form.paymentDate ? new Date(form.paymentDate) : null}
    onChange={(date) =>
      setForm({ ...form, paymentDate: date?.toISOString().split("T")[0] || '' })
    }
    dateFormat="yyyy-MM-dd"
    placeholderText="তারিখ নির্বাচন করুন"
    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
    required
  />


             
          </div>

          <div className="md:col-span-2">
            <label htmlFor="comments" className="block mb-1 font-medium text-gray-700">
              মন্তব্য (যদি থাকে)
            </label>
            <input
              id="comments"
              type="text"
              value={form.comments}
              onChange={e => setForm({ ...form, comments: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold transition ${
            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } flex justify-center items-center gap-2`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {editingId ? '✅ আপডেট করুন' : '✅ সংরক্ষণ করুন'}
        </button>
      </form>

      {/* Collections Table */}
      <div className="bg-white border border-gray-300 p-4 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 হোল্ডিং কালেকশন তালিকা</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-600">লোড হচ্ছে...</div>
        ) : (
          <table className="w-full text-sm border-collapse border border-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">হোল্ডিং মালিক</th>
                <th className="border border-gray-300 p-2 text-left">হোল্ডিং নাম্বার</th>
                <th className="border border-gray-300 p-2 text-left">আর্থিক বছর</th>
                <th className="border border-gray-300 p-2 text-right">পরিমাণ</th>
                <th className="border border-gray-300 p-2 text-left">পেমেন্ট তারিখ</th>
                <th className="border border-gray-300 p-2 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {collections.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-600">
                    কোনো কালেকশন পাওয়া যায়নি।
                  </td>
                </tr>
              )}
              {collections.map(c => (
                <tr key={c.id} className="hover:bg-green-50 transition">
                  <td className="border border-gray-300 p-2">{c.holdingInformation?.headName || '---'}</td>
                  <td className="border border-gray-300 p-2">{c.holdingNumber}</td>
                  <td className="border border-gray-300 p-2">{c.fiscalYear.replace('Y', '').replace('_', '-')}</td>
                  <td className="border border-gray-300 p-2 text-right">{c.amount}</td>
                  <td className="border border-gray-300 p-2">{c.paymentDate ? c.paymentDate.substring(0, 10) : ''}</td>
                  <td className="border border-gray-300 p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600 hover:text-blue-800  text-xl"
                      aria-label="Edit"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:text-red-800 text-xl"
                      aria-label="Delete"
                      title="Delete"
                      disabled={loading}
                    >
                      🗑
                    </button>

                    <button
                      onClick={() => handlePrint(c)}
                      className="text-green-600 text-xl"
                    >
                      🖨️
                    </button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  )
}
