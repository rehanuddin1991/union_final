"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DailyCollectionPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    team: "",
    receipt: "",
    total_taka: "",
    total_cost: "",
    date: "",
    area: "",
    comments: "",
    gram_police: "",
  });

  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  

  const getData = async () => {
  setLoading(true); // ✅ লোডিং শুরু
  try {
    const res = await fetch("/api/daily_collection");
    const json = await res.json();
    setData(json.daily_collections || []);
  } catch (error) {
    toast.error("ডাটা লোডিং ব্যর্থ হয়েছে!");
  } finally {
    setLoading(false); // ✅ লোডিং শেষ
  }
};


  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); // ✅ লোডিং শুরু

  const method = editingId ? "PATCH" : "POST";
  const url = editingId
    ? `/api/daily_collection?id=${editingId}`
    : "/api/daily_collection";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(editingId ? "আপডেট সফল হয়েছে!" : "সংরক্ষণ সফল হয়েছে!");
      setForm({
        team: "",
        receipt: "",
        total_taka: "",
        total_cost: "",
        date: "",
        area: "",
        comments: "",
        gram_police: "",
      });
      setEditingId(null);
      getData();
    } else {
      toast.error("সাবমিশনে সমস্যা হয়েছে!");
    }
  } finally {
    setLoading(false); // ✅ লোডিং শেষ
  }
};


  const handleEdit = (item) => {
  setForm({
    team: item.team || "",
    receipt: item.receipt || "",
    total_taka: item.total_taka ?? "", // null হলে "" হবে
    total_cost: item.total_cost ?? "",
    date: item.date ? item.date.split("T")[0] : "",
    area: item.area || "",
    comments: item.comments || "",
    gram_police: item.gram_police || "",
  });
  setEditingId(item.id);
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  const handleDelete = async (id) => {
    if (!confirm("আপনি কি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/daily_collection?id=${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      toast.success("ডিলিট হয়েছে!");
      getData();
    } else {
      toast.error("ডিলিট ব্যর্থ হয়েছে!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white via-green-50 to-green-100 p-8 rounded-2xl shadow-2xl border border-green-200 mb-8 transition-all duration-300 hover:shadow-green-200/50"
      >
        <h2 className="text-2xl font-extrabold mb-6 text-green-800 drop-shadow-md">
          {editingId ? "✏️ দৈনিক সংগ্রহ আপডেট" : "📝 নতুন দৈনিক সংগ্রহ যোগ করুন"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="font-medium block mb-1 text-green-700">
              টিমের নাম<span className="text-red-600 text-xl">*</span>
            </label>
            <select
              value={form.team}
              onChange={(e) => setForm({ ...form, team: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- টিম নির্বাচন করুন --</option>
              <option value="ফাহাদ,রনি">ফাহাদ,রনি</option>
              <option value="আরাফাত, সাইমুন">আরাফাত, সাইমুন</option>
              <option value="রিমন,রিফাত">রিমন,রিফাত</option>
              <option value="রিমন,আরাফাত">রিমন,আরাফাত</option>
              <option value="সাইমুন,রিফাত">সাইমুন,রিফাত</option>
              <option value="রনি,রিফাত">রনি,রিফাত</option>
              <option value="অন্যান্য">অন্যান্য</option>
              <option value="সকল">সকল</option>
            </select>
          </div>

          <div>
            <label className="font-medium block mb-1 text-green-700">
              রিসিট সংখ্যা<span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="text"
              value={form.receipt}
              onChange={(e) => setForm({ ...form, receipt: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="font-medium block mb-1 text-green-700">
              মোট সংগৃহীত টাকা<span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="text"
              value={form.total_taka}
              onChange={(e) => setForm({ ...form, total_taka: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="font-medium block mb-1 text-green-700">
              মোট খরচ<span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="text"
              value={form.total_cost}
              onChange={(e) =>
                setForm({ ...form, total_cost: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium block mb-1 text-green-700">
              তারিখ<span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="font-medium block mb-1 text-green-700">
              এলাকা<span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="text"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="w-full border rounded px-3 py-2" required
            />
          </div>

          <div>
            <label className="font-medium block mb-1 text-green-700">
              গ্রাম পুলিশ<span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="text"
              value={form.gram_police}
              onChange={(e) =>
                setForm({ ...form, gram_police: e.target.value })
              }
              className="w-full border rounded px-3 py-2" required
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <label className="font-medium block mb-1 text-green-700">
              মন্তব্য
            </label>
            <textarea
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
        </div>

        

        <button
  type="submit"
  disabled={loading}
  className={`w-full bg-gradient-to-r from-green-600 to-green-700 
  hover:from-green-700 hover:to-green-800 text-white py-3 mt-4 
  rounded-xl font-semibold shadow-lg transition-all duration-300
  ${loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-green-300"}`}
>
  {loading
    ? "⏳ লোড হচ্ছে..."
    : editingId
    ? "✅ Update"
    : "✅ Save"}
</button>
      </form>

      {loading && (
  <div className="text-center my-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
    <p className="text-green-700 text-sm mt-2">লোড হচ্ছে...</p>
  </div>
)}

      <div className="bg-white border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📋 দৈনিক সংগ্রহ তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-2">তারিখ</th>
              <th className="border p-2">টিম</th>
              <th className="border p-2">রশিদ</th>
              <th className="border p-2">মোট টাকা</th>
              <th className="border p-2">মোট খরচ</th>
              <th className="border p-2">এলাকা</th>
              <th className="border p-2">গ্রাম পুলিশ</th>
              <th className="border p-2">মন্তব্য</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">
                  {item.date
                    ? new Date(item.date).toLocaleDateString("bn-BD")
                    : ""}
                </td>
                <td className="border p-2">{item.team}</td>
                <td className="border p-2">{item.receipt}</td>
                <td className="border p-2">{item.total_taka}</td>
                <td className="border p-2">{item.total_cost}</td>
                <td className="border p-2">{item.area}</td>
                <td className="border p-2">{item.gram_police}</td>
                <td className="border p-2">{item.comments}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 mr-2 text-3xl"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600  "
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  কোনো তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-200 font-semibold">
            <tr>
              <td className="border px-2 py-1 text-right" colSpan={3}>
                Grand Total
              </td>
              <td className="border px-2 py-1">
                {data
                  .reduce(
                    (sum, item) =>
                      sum +
                      (item.total_taka
                        ? parseFloat(item.total_taka.replace(/,/g, "")) || 0
                        : 0),
                    0
                  )
                  .toLocaleString("bn-BD")}
              </td>
              <td className="border px-2 py-1">
                {data
                  .reduce(
                    (sum, item) =>
                      sum +
                      (item.total_cost
                        ? parseFloat(item.total_cost.replace(/,/g, "")) || 0
                        : 0),
                    0
                  )
                  .toLocaleString("bn-BD")}
              </td>
              <td className="border px-2 py-1" colSpan={4}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
