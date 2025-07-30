"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function InstitutionsPage() {
  const [form, setForm] = useState({
    type: "",
    name: "",
    head: "",
    address: "",
    headMobile: "",
    comments: "",
  });
  const [institutions, setInstitutions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchInstitutions = async () => {
    try {
      const res = await fetch("/api/institutions");
      const json = await res.json();
      if (Array.isArray(json)) {
        setInstitutions(json);
      } else {
        toast.error("ডেটা লোড ব্যর্থ হয়েছে");
        console.error("Unexpected response:", json);
      }
    } catch (err) {
      toast.error("ডেটা লোড ব্যর্থ হয়েছে");
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/institutions?id=${editingId}` : "/api/institutions";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "আপডেট সফল" : "সংরক্ষণ সফল");
        setForm({ type: "", name: "", head: "", address: "", headMobile: "", comments: "" });
        setEditingId(null);
        fetchInstitutions();
      } else {
        toast.error("ব্যর্থ হয়েছে");
      }
    } catch (err) {
      toast.error("এরর হয়েছে");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("আপনি কি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/institutions?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("মুছে ফেলা হয়েছে");
      fetchInstitutions();
    }
  };

  const handleEdit = (item) => {
    setForm({
      type: item.type,
      name: item.name,
      head: item.head,
      address: item.address,
      headMobile: item.headMobile,
      comments: item.comments || "",
    });
    setEditingId(item.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {editingId ? "✏️ প্রতিষ্ঠান আপডেট" : "📝 নতুন ইনস্টিটিউশন"}
        </h2>

        <label className="block mb-1 font-medium">প্রতিষ্ঠানের ধরন: <span className="text-red-600 text-xl ">*</span></label>
          <select
    value={form.type}
    onChange={(e) => setForm({ ...form, type: e.target.value })}
    className="w-full p-2 border rounded mb-4"
    required
  >
    <option value="">-- প্রতিষ্ঠান নির্বাচন করুন --</option>
    <option value="প্রাথমিক বিদ্যালয়">প্রাথমিক বিদ্যালয়</option>
    <option value="মাধ্যমিক বিদ্যালয়">মাধ্যমিক বিদ্যালয়</option>
    <option value="উচ্চ মাধ্যমিক">উচ্চ মাধ্যমিক</option>
    <option value="মাদ্রাসা">মাদ্রাসা</option>
    <option value="কলেজ">কলেজ</option>
    <option value="বিশ্ববিদ্যালয়">বিশ্ববিদ্যালয়</option>    
    <option value="টেকনিক্যাল ইনস্টিটিউট">টেকনিক্যাল ইনস্টিটিউট</option>
      <option value="মসজিদ">মসজিদ</option>
    <option value="মন্দির">মন্দির</option>
    <option value="গির্জা">গির্জা</option>
    <option value="বৌদ্ধ বিহার">বৌদ্ধ বিহার</option>
    <option value="প্যাগোডা">প্যাগোডা</option>
    <option value="কিন্ডারগার্টেন">কিন্ডারগার্টেন</option>
    <option value="অন্যান্য">অন্যান্য</option>
  </select>

        <label className="block mb-1 font-medium">প্রতিষ্ঠানের নাম<span className="text-red-600 text-xl ">*</span></label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-1 font-medium">প্রতিষ্ঠান প্রধানের নাম<span className="text-red-600 text-xl ">*</span></label>
        <input
          type="text"
          value={form.head}
          onChange={(e) => setForm({ ...form, head: e.target.value })}
          className="w-full p-2 border rounded mb-4" required
        />

        <label className="block mb-1 font-medium">ঠিকানা<span className="text-red-600 text-xl ">*</span></label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full p-2 border rounded mb-4" required
        />

        <label className="block mb-1 font-medium">প্রধানের মোবাইল<span className="text-red-600 text-xl ">*</span></label>
        <input
          type="text"
          value={form.headMobile}
          onChange={(e) => setForm({ ...form, headMobile: e.target.value })}
          className="w-full p-2 border rounded mb-4" required
        />

        <label className="block mb-1 font-medium">মন্তব্য</label>
        <textarea
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          {editingId ? "✅ আপডেট করুন" : "✅ সংরক্ষণ করুন"}
        </button>
      </form>

      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-3">📋 সকল প্রতিষ্ঠানের তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">প্রতিষ্ঠানের নাম</th>
              <th className="border p-2">প্রধান</th>
              <th className="border p-2">মোবাইল</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.head}</td>
                <td className="border p-2">{item.headMobile}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 mr-2">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600">
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
