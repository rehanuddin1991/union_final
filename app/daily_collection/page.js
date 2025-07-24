"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DailyCollectionPage() {
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

  const getData = async () => {
    const res = await fetch("/api/daily_collection");
    const json = await res.json();
    setData(json.daily_collections || []);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/daily_collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("সংগ্রহ সংরক্ষণ হয়েছে!");
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
      getData();
    } else {
      toast.error("সাবমিশনে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
  <ToastContainer />
  <h1 className="text-xl font-bold">নতুন দৈনিক সংগ্রহ যোগ করুন(সব সংখ্যা ইংরেজিতে হবে)</h1>

  <form
    onSubmit={handleSubmit}
    className="bg-white shadow p-4 rounded-xl space-y-6 border"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <label className="font-medium block mb-1 text-[darkcyan]">টিমের নাম<span className="text-red-600 text-xl ">*</span></label>
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
          <option value="অন্যান্য">অন্যান্য</option>
          <option value="সকল">সকল</option>
        </select>
      </div>

      <div>
        <label className="font-medium block mb-1 text-[darkcyan]">রিসিট সংখ্যা<span className="text-red-600 text-xl ">*</span></label>
        <input
          type="text"
          value={form.receipt}
          onChange={(e) => setForm({ ...form, receipt: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="font-medium block mb-1 text-[darkcyan]">মোট সংগৃহীত টাকা
            <span className="text-red-600 text-xl ">*</span></label>
        <input
          type="text"
          value={form.total_taka}
          onChange={(e) => setForm({ ...form, total_taka: e.target.value })}
          className="w-full border rounded px-3 py-2" required
        />
      </div>

      <div>
        <label className="font-medium block mb-1 text-[darkcyan]">মোট খরচ<span className="text-red-600 text-xl ">*</span></label>
        <input
          type="text"
          value={form.total_cost}
          onChange={(e) => setForm({ ...form, total_cost: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="font-medium block mb-1 text-[darkcyan]">তারিখ<span className="text-red-600 text-xl ">*</span></label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border rounded px-3 py-2" required
        />
      </div>

      <div>
        <label className="font-medium block mb-1 text-[darkcyan]">এলাকা<span className="text-red-600 text-xl ">*</span></label>
        <input
          type="text"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="font-medium block mb-1 text-[darkcyan]">গ্রাম পুলিশ</label>
        <input
          type="text"
          value={form.gram_police}
          onChange={(e) => setForm({ ...form, gram_police: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="sm:col-span-2 md:col-span-3 text-[darkcyan]">
        <label className="font-medium block mb-1">মন্তব্য</label>
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
      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
    >
      সংরক্ষণ করুন
    </button>
  </form>

 <div>
  <h2 className="text-lg font-bold mt-8 mb-4">দৈনিক সংগ্রহ তালিকা</h2>
  <div className="overflow-x-auto">
    <table className="w-full border text-sm min-w-max">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">তারিখ</th>
          <th className="border px-2 py-1">টিম</th>
          <th className="border px-2 py-1">রশিদ</th>
          <th className="border px-2 py-1">মোট টাকা</th>
          <th className="border px-2 py-1">মোট খরচ</th>
          <th className="border px-2 py-1">এলাকা</th>
          <th className="border px-2 py-1">গ্রাম পুলিশ</th>
          <th className="border px-2 py-1">মন্তব্য</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td className="border px-2 py-1">
              {item.date
                ? new Date(item.date).toLocaleDateString("bn-BD")
                : ""}
            </td>
            <td className="border px-2 py-1">{item.team}</td>
            <td className="border px-2 py-1">{item.receipt}</td>
            <td className="border px-2 py-1">{item.total_taka}</td>
            <td className="border px-2 py-1">{item.total_cost}</td>
            <td className="border px-2 py-1">{item.area}</td>
            <td className="border px-2 py-1">{item.gram_police}</td>
            <td className="border px-2 py-1">{item.comments}</td>
          </tr>
        ))}
      </tbody>
      <tfoot className="bg-gray-200 font-semibold">
        <tr>
          <td className="border px-2 py-1 text-right" colSpan={3}>
            Grand Total
          </td>
          <td className="border px-2 py-1">
            {/* মোট total_taka যোগফল */}
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
            {/* মোট total_cost যোগফল */}
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
          <td className="border px-2 py-1" colSpan={2}></td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

</div>

  );
}
