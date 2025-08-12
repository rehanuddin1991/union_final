"use client";
import { useState, useEffect } from "react";

export default function IncomeExpenseReport() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const fetchReport = async () => {
    let url = `/api/income-expenses/report`;
    if (start && end) {
      url += `?start=${start}&end=${end}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      setRecords(data.records);
      setSummary(data.summary);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">আয়-ব্যয় রিপোর্ট</h1>

      {/* Date Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={fetchReport} className="bg-blue-500 text-white px-4 py-2 rounded">
          রিপোর্ট দেখাও
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-4 mb-4">
        <div className="bg-green-100 p-4 rounded">মোট আয়: {summary.totalIncome.toFixed(2)} টাকা</div>
        <div className="bg-red-100 p-4 rounded">মোট ব্যয়: {summary.totalExpense.toFixed(2)} টাকা</div>
        <div className="bg-yellow-100 p-4 rounded">ব্যালেন্স: {summary.balance.toFixed(2)} টাকা</div>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">তারিখ</th>
            <th className="p-2 border">ধরন</th>
            <th className="p-2 border">শিরোনাম</th>
           <th className="border border-gray-400 px-4 py-2">আয় (৳)</th>
      <th className="border border-gray-400 px-4 py-2">ব্যয় (৳)</th>
            <th className="p-2 border">নোট</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border">{new Date(r.date).toLocaleDateString("bn-BD")}</td>
              <td className={`p-2 border ${r.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                {r.type === "INCOME" ? "আয়" : "ব্যয়"}
              </td>
              <td className="p-2 border">{r.title}</td>
               
               <td className="border border-gray-400 px-4 py-2">
          {r.type === "INCOME" ? r.amount.toFixed(2) : ""}
        </td>
        <td className="border border-gray-400 px-4 py-2">
          {r.type === "EXPENSE" ? r.amount.toFixed(2) : ""}
        </td>
              <td className="p-2 border">{r.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
