"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InstitutionPage() {
  const [form, setForm] = useState({
    type: "",
    name: "",
    head: "",
    address: "",
    headMobile: "",
    comments: "",
  });

  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await fetch("/api/institution");  
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/institution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("ইনস্টিটিউশন যোগ হয়েছে!");
      setForm({
        type: "",
        name: "",
        head: "",
        address: "",
        headMobile: "",
        comments: "",
      });
      getData();
    } else {
      toast.error("সাবমিশনে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToastContainer />
      <h1 className="text-xl font-bold">নতুন ইনস্টিটিউশন যোগ করুন</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded-xl space-y-4 border">
        <div>
          <label className="font-medium">প্রতিষ্ঠানের ধরন</label>
          <input
            type="text"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="font-medium">প্রতিষ্ঠানের নাম</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="font-medium">প্রধানের নাম</label>
          <input
            type="text"
            value={form.head}
            onChange={(e) => setForm({ ...form, head: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="font-medium">ঠিকানা</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="font-medium">মোবাইল</label>
          <input
            type="text"
            value={form.headMobile}
            onChange={(e) => setForm({ ...form, headMobile: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="font-medium">মন্তব্য</label>
          <textarea
            value={form.comments}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          সংরক্ষণ করুন
        </button>
      </form>

      <div>
        <h2 className="text-lg font-bold mt-8 mb-4">ইনস্টিটিউশন তালিকা</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">নাম</th>
              <th className="border px-2 py-1">প্রধান</th>
              <th className="border px-2 py-1">ঠিকানা</th>
              <th className="border px-2 py-1">মোবাইল</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.head}</td>
                <td className="border px-2 py-1">{item.address}</td>
                <td className="border px-2 py-1">{item.headMobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
