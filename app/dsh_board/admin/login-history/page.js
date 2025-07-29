"use client";

import { useEffect, useState } from "react";

export default function LoginHistoryPage() {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistories() {
      try {
        const res = await fetch("/api/login-history");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Data is not an array");
        setHistories(data);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchHistories();
  }, []);

  if (loading) return <p>লোড হচ্ছে...</p>;
  if (error) return <p className="text-red-600">ত্রুটি: {error}</p>;
  if (histories.length === 0) return <p>কোনো লগইন হিস্টোরি পাওয়া যায়নি।</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">লগইন হিস্টোরি</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">নাম</th>
            <th className="border border-gray-300 p-2">ইমেইল</th>
            <th className="border border-gray-300 p-2">আইপি অ্যাড্রেস</th>
            <th className="border border-gray-300 p-2">টাইমস্ট্যাম্প</th>
            <th className="border border-gray-300 p-2">স্ট্যাটাস</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((log) => (
            <tr key={log.id} className="text-center">
              <td className="border border-gray-300 p-2">{log.id}</td>
              <td className="border border-gray-300 p-2">{log.user?.name || "-"}</td>
              <td className="border border-gray-300 p-2">{log.user?.email || "-"}</td>
              <td className="border border-gray-300 p-2">{log.ipAddress || "-"}</td>
              <td className="border border-gray-300 p-2">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td
                className={`border border-gray-300 p-2 font-semibold ${
                  log.status === "SUCCESS"
                    ? "text-green-600"
                    : log.status === "FAILURE"
                    ? "text-red-600"
                    : ""
                }`}
              >
                {log.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
