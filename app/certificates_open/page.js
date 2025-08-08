"use client";
import { useEffect, useState, useRef } from "react";
//import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
 

export default function CertificatesPage() {
  const [loading, setLoading] = useState(false);
 const [now, setNow] = useState(null);
   

  const handleLoadDefaultNote = (type) => {
    let defaultNote = "";

    if (type === 1) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন। আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else {
      defaultNote = `
      <p>তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা। সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি,
       তিনি জন্মসূত্রে বাংলাদেশী নাগরিক। উক্ত ব্যক্তির জন্ম/জাতীয় সনদসহ অন্যান্য সনদে ${
         form.applicantName || "আবেদনকারী"
       } পরিলক্ষিত হলেও, ভুলবশত তাঁর নামীয় কিছু কাগজপত্রে (ভূমি/অন্যান্য) ${
        form.applicantName || "আবেদনকারী"
      } লেখা আছে।  আমার জানামতে, ${form.applicantName || "আবেদনকারী"} ও ${
        form.applicantName || "আবেদনকারী"
      } একই ব্যক্তি। আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    }

    setForm((prevForm) => ({
      ...prevForm,
      notes: defaultNote,
    }));
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

  




  useEffect(() => {
    
    setNow(new Date().toLocaleDateString());
  }, []);

   

    

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
  setLoading(true); // ✅ লোডিং শুরু

  // Required validation
    if (!form.applicantName || form.applicantName.trim() === "") {
      toast.error("নাম অবশ্যই দিতে হবে");
      setLoading(false);
      return;
    }

     
    if (!form.fatherName || form.fatherName.trim() === "") {
      toast.error("পিতার নাম অবশ্যই দিতে হবে");
      setLoading(false);
      return;
    }

     
    if (!form.motherName || form.motherName.trim() === "") {
      toast.error("মাতার নাম অবশ্যই দিতে হবে");
      setLoading(false);
      return;
    }

     if (
    (!form.nid || form.nid.trim() === "") &&
    (!form.birth_no || form.birth_no.trim() === "")
  ) {
    toast.error("NID অথবা জন্ম নিবন্ধন নম্বর যেকোনো একটি দিতে হবে");
    setLoading(false);
    return;
  }

 const payload = {
    ...form,
    letter_count: 0,
    is_deleted: true,
    is_approved:false,
    entry_page:"open",
    notes:"<p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>"
  };

  const method = form.id ? "PATCH" : "POST";
  const url = form.id
    ? `/api/certificates-open?id=${form.id}`
    : "/api/certificates-open";

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
       
    } else {
      toast.error("Operation failed");
    }
  } catch {
    toast.error("Error Occurred");
  } finally {
    setLoading(false); // ✅ কাজ শেষে লোডিং বন্ধ
  }
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

              
               
              <option value="নাম সংক্রান্ত প্রত্যয়ন পত্র">
                নাম সংক্রান্ত প্রত্যয়ন পত্র
              </option>
              <option value="বিবিধ সনদ">বিবিধ সনদ</option>
              <option value="চারিত্রিক সনদ">চারিত্রিক সনদ</option>
              <option value="অবিবাহিত সনদ">অবিবাহিত সনদ</option>
              <option value="ভূমিহীন সনদ">ভূমিহীন সনদ</option>
              <option value="বেকারত্ব সনদ">বেকারত্ব সনদ</option>
              <option value="স্বামী পরিত্যক্তা সনদ">
                স্বামী পরিত্যক্তা সনদ
              </option>
              <option value="বিধবা সনদ">বিধবা সনদ</option>
              <option value="সম্প্রদায় সনদ">সম্প্রদায় সনদ</option>
              <option value="বার্ষিক আয়ের সনদ">বার্ষিক আয়ের সনদ</option>
              <option value="ভোটার স্থানান্তর সংক্রান্ত সনদ">
                ভোটার স্থানান্তর সংক্রান্ত সনদ
              </option>
              <option value="অভিভাবক সম্মতিপত্র">অভিভাবক সম্মতিপত্র</option>
              <option value="দ্বিতীয়/পুনঃ বিবাহ না হওয়ার সনদপত্র">
                দ্বিতীয়/পুনঃ বিবাহ না হওয়ার সনদপত্র
              </option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              আবেদনকারীর নাম  <span className="text-red-600 text-xl ">*</span>
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
            <label className="font-semibold text-indigo-700">পিতার নাম<span className="text-red-600 text-xl ">*</span></label>
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
            <label className="font-semibold text-indigo-700">মাতার নাম<span className="text-red-600 text-xl ">*</span></label>
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
            <label className="font-semibold text-indigo-700">জন্ম তারিখ<span className="text-red-600 text-xl ">*</span></label>
             
 <br></br>
             


                    <DatePicker
                                  id="birthDate"
                                  selected={form.birthDate ? new Date(form.birthDate) : null}
                                  onChange={(date) =>
                                    setForm({
                                      ...form,
                                      birthDate: date
                                        ? new Date(
                                            date.getTime() - date.getTimezoneOffset() * 60000
                                          )
                                            .toISOString()
                                            .split("T")[0]
                                        : "",
                                    })
                                  }
                                  dateFormat="yyyy-MM-dd"
                                  placeholderText="জন্ম তারিখ নির্বাচন করুন"
                                  className="border p-2 rounded w-full min-w-64"
                                  required
                                />


          </div>
           

          <div>
            <label className="font-semibold text-indigo-700">
              জাতীয় পরিচয়পত্র নম্বর
            </label>
            <input
              type="text"
              value={form.nid ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                // ✅ শুধু ইংরেজি সংখ্যা (0-9) ইনপুট অনুমোদিত
                if (/^[0-9]*$/.test(value)) {
                  setForm({ ...form, nid: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="NID (শুধু ইংরেজি সংখ্যা লিখুন)"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              জন্ম নিবন্ধন নম্বর
            </label>

            <input
              type="text"
              value={form.birth_no ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                // ✅ কেবল বাংলা সংখ্যা (০-৯) অনুমোদিত
                if (/^[0-9]*$/.test(value)) {
                  setForm({ ...form, birth_no: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="ইংরেজি সংখ্যায় লিখুন"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">ওয়ার্ড</label>
            <input
              type="text"
              value={form.ward ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                // ✅ কেবল বাংলা সংখ্যা (০-৯) অনুমোদিত
                if (/^[0-9]*$/.test(value)) {
                  setForm({ ...form, ward: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="ইংরেজি সংখ্যায় লিখুন"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">হোল্ডিং</label>
            <input
              type="text"
              value={form.holding_no ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                // ✅ কেবল বাংলা সংখ্যা (০-৯) অনুমোদিত
                if (/^[0-9]*$/.test(value)) {
                  setForm({ ...form, holding_no: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="ইংরেজি সংখ্যায় লিখুন"
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
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              পোস্ট অফিস<span className="text-red-600 text-xl ">*</span>
            </label>
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
            <label className="font-semibold text-indigo-700">
              ঠিকানা(গ্রাম)<span className="text-red-600 text-xl ">*</span>
            </label>
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
                  প্রতিষ্ঠানের নাম<span className="text-red-600 text-xl ">*</span>
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
                  প্রতিষ্ঠানের ঠিকানা<span className="text-red-600 text-xl ">*</span>
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
                  ট্রেডের ধরন<span className="text-red-600 text-xl ">*</span>
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
                  ট্রেড লাইসেন্স ফি<span className="text-red-600 text-xl ">*</span>
                </label>

                <input
                  type="text"
                  value={form.trade_fee ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // ✅ কেবল বাংলা সংখ্যা (০-৯) অনুমোদিত
                    if (/^[০-৯]*$/.test(value)) {
                      setForm({ ...form, trade_fee: value });
                    }
                  }}
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
                  value={form.trade_capital_tax ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // ✅ কেবল বাংলা সংখ্যা (০-৯) অনুমোদিত
                    if (/^[০-৯]*$/.test(value)) {
                      setForm({ ...form, trade_capital_tax: value });
                    }
                  }}
                  className="border p-2 rounded w-full"
                  placeholder="মুলধন কর"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">বকেয়া</label>

                <input
                  type="text"
                  value={form.trade_due ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // ✅ কেবল বাংলা সংখ্যা (০-৯) অনুমোদিত
                    if (/^[০-৯]*$/.test(value)) {
                      setForm({ ...form, trade_due: value });
                    }
                  }}
                  className="border p-2 rounded w-full"
                  placeholder="বকেয়া"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">ভ্যাট</label>

                <input
                  type="text"
                  value={form.trade_vat ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // ✅ কেবল বাংলা সংখ্যা (০-৯) অনুমোদিত
                    if (/^[০-৯]*$/.test(value)) {
                      setForm({ ...form, trade_vat: value });
                    }
                  }}
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
                  value={form.trade_total_tax ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // ✅ কেবল বাংলা সংখ্যা (০-৯) অনুমোদিত
                    if (/^[০-৯]*$/.test(value)) {
                      setForm({ ...form, trade_total_tax: value });
                    }
                  }}
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

          {/* <div>
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
          </div> */}

          <div className="hidden">
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

        {/* <div className="mt-4">
          <label className="font-semibold text-indigo-700">নোটস</label>
          <button
            type="button"
            onClick={() => handleLoadDefaultNote(1)}
            className="bg-green-500 text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(2)}
            className="bg-green-500 text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default (নাম সংক্রান্ত প্রত্যয়ন)
          </button>
          
        </div> */}

       <button
  type="submit"
  disabled={loading} // ✅ লোডিং চললে ডিসেবল হবে
  className={`w-full bg-blue-600 text-white py-2 rounded mt-4 
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
>
  {loading
    ? "⏳ loading..."
    : form.id
    ? "Update"
    : "Save"}
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

       

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
