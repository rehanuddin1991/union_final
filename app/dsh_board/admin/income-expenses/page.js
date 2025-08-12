"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";

export default function IncomeExpensePage() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    type: "INCOME",
    title: "",
    amount: "",
    date: new Date(),
    notes: "",
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/income-expenses");
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      } else {
        toast.error("তথ্য লোড করতে ব্যর্থ");
      }
    } catch {
      toast.error("লোডিং সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title || form.title.trim() === "") {
      toast.error("শিরোনাম অবশ্যই দিতে হবে");
      setLoading(false);
      return;
    }
    if (!form.amount || isNaN(Number(form.amount))) {
      toast.error("পরিমাণ অবশ্যই একটি সংখ্যা হতে হবে");
      setLoading(false);
      return;
    }

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `/api/income-expenses?id=${editingId}`
      : "/api/income-expenses";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          date: form.date,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "আপডেট হয়েছে" : "সংরক্ষিত");
        setForm({
          type: "INCOME",
          title: "",
          amount: "",
          date: new Date(),
          notes: "",
        });
        setEditingId(null);
        fetchRecords();
      } else {
        toast.error("ব্যর্থ");
      }
    } catch {
      toast.error("এরর হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("আপনি কি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/income-expenses?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      toast.success("ডিলিট হয়েছে");
      fetchRecords();
    }
  };

  const handleEdit = (rec) => {
    setForm({
      type: rec.type,
      title: rec.title,
      amount: rec.amount,
      date: new Date(rec.date),
      notes: rec.notes || "",
    });
    setEditingId(rec.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white via-green-50 to-green-100 p-8 rounded-2xl shadow-2xl border border-green-200 mb-8"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-green-800">
          {editingId ? "✏️ আয়-ব্যয় আপডেট" : "📝 নতুন আয়-ব্যয় যোগ করুন"}
        </h2>

        {/* টাইপ */}
        <label className="block mb-1 font-medium text-green-700">
          ধরন <span className="text-red-600">*</span>
        </label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-3 mb-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400"
        >
          <option value="INCOME">আয়</option>
          <option value="EXPENSE">ব্যয়</option>
        </select>

        {/* শিরোনাম */}
        <label className="block mb-1 font-medium text-green-700">
          শিরোনাম <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 mb-4 border border-green-200 rounded-xl"
          placeholder="৩টি নাগরিক, ২টি ট্রেড, হোল্ডিং বাবাদ"
        />

        {/* পরিমাণ */}
        <label className="block mb-1 font-medium text-green-700">
          পরিমাণ <span className="text-red-600">*(সংখ্যা)</span>
        </label>
        <input
          type="text"
          value={form.amount}
           
placeholder="20.25"

          onChange={(e) => {
  let value = e.target.value;

  // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
  value = value.replace(/[০-৯]/g, (digit) =>
    String("০১২৩৪৫৬৭৮৯".indexOf(digit))
  );

  // ✅ বাংলা ডট (।) কে ইংরেজি ডট (.) তে রূপান্তর
  value = value.replace(/।/g, ".");

  // ✅ শুধু সংখ্যা এবং একটিমাত্র ডট অনুমোদিত
  if (/^[0-9]*\.?[0-9]*$/.test(value)) {
    setForm({ ...form, amount: value });
  }
}}

          className="w-full p-3 mb-4 border border-green-200 rounded-xl"
        />

        {/* তারিখ */}
        <label className="block mb-1 font-medium text-green-700">তারিখ</label>
        <DatePicker
          selected={form.date}
          onChange={(date) => setForm({ ...form, date })}
          dateFormat="yyyy-MM-dd"
          className="w-full p-3 mb-4 border border-green-200 rounded-xl"
        />

        {/* নোটস */}
        <label className="block mb-1 font-medium text-green-700">
          মন্তব্য (Optional)
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full p-3 mb-4 border border-green-200 rounded-xl h-28"
          placeholder="নাগরিক=২৫০ টাকা, ট্রেড=৪০০, হোল্ডিং: কাঁচা ঘর=২০০, পাকা ঘর=৪০০"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50"
        >
          {loading
            ? editingId
              ? "⏳ আপডেট হচ্ছে..."
              : "⏳ সংরক্ষণ হচ্ছে..."
            : editingId
            ? "✅ আপডেট"
            : "✅ সংরক্ষণ করুন"}
        </button>
      </form>

      {/* List */}
      <div className="bg-white border p-4 rounded-xl shadow">
        {loading && (
          <p className="text-center text-green-600">লোড হচ্ছে...</p>
        )}
        <h2 className="text-xl font-semibold mb-3">📋 আয়-ব্যয়ের তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-2">ধরন</th>
              <th className="border p-2">শিরোনাম</th>
              <th className="border p-2">পরিমাণ</th>
              <th className="border p-2">তারিখ</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td className="border p-2">
                  {rec.type === "INCOME" ? "আয়" : "ব্যয়"}
                </td>
                <td className="border p-2">{rec.title}</td>
                <td className="border p-2">{rec.amount}</td>
                <td className="border p-2">
                  {new Date(rec.date).toLocaleDateString("bn-BD")}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(rec)}
                    className="text-blue-600 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="text-red-600"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  কোনো তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
