"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function PoorPage() {
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
  const res = await fetch("/api/poor");
  const data = await res.json();
  if (data.success) setPoorList(data.data);
  else toast.error("তথ্য লোড করতে ব্যর্থ");
};


  useEffect(() => {
    fetchPoorList();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  const method = editingId ? "PATCH" : "POST";
  const url = editingId ? `/api/poor?id=${editingId}` : "/api/poor";

  try {
    // PATCH হলে id সহ form পাঠাও
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
    } else toast.error("ব্যর্থ");
  } catch {
    toast.error("এরর হয়েছে");
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
        <h2 className="text-2xl font-bold mb-6 text-yellow-800"> যারা হতদরিদ্র,প্রতিবন্ধী, অসুস্থ  এবং সবসময় সহযোগিতা পাওয়ার যোগ্য--তাঁদের তালিকা।
          {editingId ? "✏️ দরিদ্র তালিকা আপডেট" : "➕ নতুন দরিদ্র ব্যক্তি"}
        </h2>

        {[
          { label: "নাম", name: "name", required: true },
          { label: "পিতার নাম", name: "father" },
          { label: "মাতার নাম", name: "mother" },
          { label: "জাতীয় পরিচয়পত্র", name: "nid" },
          { label: "মোবাইল", name: "mobile" },
          { label: "ওয়ার্ড", name: "ward" },
          { label: "ঠিকানা", name: "address" },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block font-medium text-yellow-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-600"> *</span>}
            </label>
            <input
              type="text"
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              className="w-full p-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
              required={field.required}
            />
          </div>
        ))}

        <label className="block font-medium text-yellow-700 mb-1">মন্তব্য</label>
        <textarea
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          className="w-full p-3 border border-yellow-200 rounded-xl h-24 focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm mb-4"
        />

        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all"
        >
          {editingId ? "✅ আপডেট" : "✅ সংরক্ষণ করুন"}
        </button>
      </form>

      <div className="bg-white border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📋 দরিদ্র ব্যক্তিদের তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-yellow-100">
            <tr>
              <th className="border p-2">নাম</th>
              <th className="border p-2">মোবাইল</th>
              <th className="border p-2">ওয়ার্ড</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
         <tbody>
  {Array.isArray(poorList) && poorList.length > 0 ? (
    poorList.map((p) => (
      <tr key={p.id}>
        <td className="border p-2">{p.name}</td>
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
