"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function PoorPage() {
   const [loading, setLoading] = useState(false); // ✅ লোডিং স্টেট
  const [submitting, setSubmitting] = useState(false); // ✅ সাবমিট লোডিং
  const [form, setForm] = useState({
    name: "",
    father: "",
    mother: "",
    nid: "",
    mobile: "",
    ward: "",
    address: "",
    comments: "",
  });
  const [poorList, setPoorList] = useState([]);
  const [editingId, setEditingId] = useState(null);

 const fetchPoorList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/poor");
      const data = await res.json();
      if (data.success) {
        setPoorList(data.data);
      } else {
        toast.error("তথ্য লোড করতে ব্যর্থ");
      }
    } catch {
      toast.error("ডেটা লোডে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPoorList();
  }, []);

 const handleSubmit = async (e) => {
    e.preventDefault();
if (!form.name.trim()) {
    toast.error("নাম অবশ্যই দিতে হবে");
    return;
  }

   
  if (!form.father.trim()) {
    toast.error("পিতার নাম অবশ্যই দিতে হবে");
    return;
  }

  if (!form.address.trim()) {
    toast.error("ঠিকানা অবশ্যই দিতে হবে");
    return;
  }

    setSubmitting(true);
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/poor?id=${editingId}` : "/api/poor";

    try {
      const bodyData = editingId ? { ...form, id: editingId } : form;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "আপডেট হয়েছে" : "সংরক্ষিত");
        setForm({
          name: "",
          father: "",
          mother: "",
          nid: "",
          mobile: "",
          ward: "",
          address: "",
          comments: "",
        });
        setEditingId(null);
        fetchPoorList();
      } else {
        toast.error("ব্যর্থ");
      }
    } catch {
      toast.error("এরর হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("আপনি কি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/poor?id=${id}`, {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id }),
});
    const data = await res.json();
    if (data.success) {
      toast.success("ডিলিট হয়েছে");
      fetchPoorList();
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || "",
      father: p.father || "",
      mother: p.mother || "",
      nid: p.nid || "",
      mobile: p.mobile || "",
      ward: p.ward || "",
      address: p.address || "",
      comments: p.comments || "",
    });
    setEditingId(p.id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form
  onSubmit={handleSubmit}
  className="bg-gradient-to-br from-white via-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-xl border border-yellow-200 mb-8"
>
  <h2 className="text-2xl font-bold mb-6 text-[cadetblue]">
    যারা হতদরিদ্র, প্রতিবন্ধী, অসুস্থ এবং সবসময় সহযোগিতা পাওয়ার যোগ্য--তাঁদের তালিকা।
    {editingId ? "✏️ দরিদ্র তালিকা আপডেট" : "➕ নতুন দরিদ্র ব্যক্তি"}
  </h2>

  {/* নাম, পিতার নাম, মাতার নাম */}
  <div className="mb-4">
    <label className="block font-medium text-[darkcyan] mb-1">
      নাম <span className="text-red-600">*</span>
    </label>
    <input
      type="text"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="w-full p-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
      required
    />
  </div>

  <div className="mb-4">
    <label className="block font-medium text-[darkcyan] mb-1">পিতার নাম<span className="text-red-600">*</span></label>
    <input
      type="text"
      value={form.father}
      onChange={(e) => setForm({ ...form, father: e.target.value })}
      className="w-full p-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
    />
  </div>

  <div className="mb-4">
    <label className="block font-medium text-[darkcyan] mb-1">মাতার নাম</label>
    <input
      type="text"
      value={form.mother}
      onChange={(e) => setForm({ ...form, mother: e.target.value })}
      className="w-full p-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
    />
  </div>

  {/* ✅ জাতীয় পরিচয়পত্র (Only English Number) */}
  <div className="mb-4">
    <label className="block font-medium text-[darkcyan] mb-1">
      জাতীয় পরিচয়পত্র
    </label>
    <input
      type="text"
      value={form.nid}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          setForm({ ...form, nid: value });
        }
      }}
      className="w-full p-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
      placeholder="শুধু ইংরেজি সংখ্যা"
    />
  </div>

  {/* ✅ মোবাইল নম্বর (Only English Number + 11 Digit) */}
  <div className="mb-4">
    <label className="block font-medium text-[darkcyan] mb-1">
      মোবাইল  
    </label>
    <input
  type="text"
  value={form.mobile}
  onChange={(e) => {
    const value = e.target.value;
    // শুধু ইংরেজি সংখ্যা গ্রহণ করবে, দৈর্ঘ্যের কোনো সীমা নেই
    if (/^\d*$/.test(value)) {
      setForm({ ...form, mobile: value });
    }
  }}
  className="w-full p-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
  placeholder="মোবাইল নম্বর (শুধু ইংরেজি সংখ্যা)"
/>

  </div>

  {/* ওয়ার্ড */}
  <div className="mb-4">
    <label className="block font-medium text-[darkcyan] mb-1">ওয়ার্ড</label>
    <input
      type="text"
      value={form.ward}
      onChange={(e) => setForm({ ...form, ward: e.target.value })}
      className="w-full p-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
    />
  </div>

  {/* ঠিকানা */}
  <div className="mb-4">
    <label className="block font-medium text-[darkcyan] mb-1">ঠিকানা<span className="text-red-600">*</span></label>
    <input
      type="text"
      value={form.address}
      required
      onChange={(e) => setForm({ ...form, address: e.target.value })}
      className="w-full p-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
    />
  </div>

  {/* মন্তব্য */}
  <label className="block font-medium text-[darkcyan] mb-1">মন্তব্য</label>
  <textarea
    value={form.comments}
    onChange={(e) => setForm({ ...form, comments: e.target.value })}
    className="w-full p-3 border border-yellow-200 rounded-xl h-24 focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm mb-4"
  />

   

   <button
          type="submit"
          disabled={submitting}
          className="w-full bg-yellow-600 hover:bg-[darkcyan] text-white py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50"
        >
          {submitting
            ? "⏳ সংরক্ষণ হচ্ছে..."
            : editingId
            ? "✅ আপডেট"
            : "✅ সংরক্ষণ করুন"}
        </button>


</form>


      <div className="bg-white border p-4 rounded-xl shadow">
          {loading && (
  <div className="text-center my-4 ">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p className="text-red-600 text-sm mt-2">loading...................................</p>
  </div>
)}
        <h2 className="text-xl font-semibold mb-3">📋 দরিদ্র ব্যক্তিদের তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-yellow-100">
            <tr>
              <th className="border p-2">নাম</th>
              <th className="border p-2">মোবাইল</th>
              <th className="border p-2">পিতা</th>
              <th className="border p-2">ওয়ার্ড</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
         <tbody>
  {Array.isArray(poorList) && poorList.length > 0 ? (
    poorList.map((p) => (
      <tr key={p.id}>
        <td className="border p-2">{p.name}</td>
        <td className="border p-2">{p.father || "-"}</td>
        <td className="border p-2">{p.mobile || "-"}</td>
        <td className="border p-2">{p.ward || "-"}</td>
        <td className="border p-2">
          <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2">✏️</button>
          <button onClick={() => handleDelete(p.id)} className="text-red-600">🗑</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="text-center p-4">
        কোনো তথ্য পাওয়া যায়নি।
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
