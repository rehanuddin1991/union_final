"use client";
import { useEffect, useState } from "react";

export default function AdminHome() {
  const [count, setCount] = useState(null);
  const [approvalPending, setApprovalPending] = useState(null);
 const [holdingCount, setHoldingCount] = useState(null);
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          fetch("/api/certificates/count?type=1"),
          fetch("/api/certificates/count?type=2"),
          fetch("/api/holding/count"), // ✅ holding API call
        ]);

        const data1 = await res1.json();
        const data2 = await res2.json();
        const data3 = await res3.json();

        if (data1.success) setCount(data1.count);
        if (data2.success) setApprovalPending(data2.count);
        if (data3.success) setHoldingCount(data3.count);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className=" flex flex-wrap gap-6 p-6 bg-gray-100">
      {/* মোট সনদ */}
      <div className="shadow-2xl rounded-2xl w-60 h-32 p-4 bg-[#5F9EA0]">
        <h2 className="text-xl font-bold text-[floralwhite]">মোট সনদ</h2>
        <p className="text-4xl font-semibold mt-2 ml-16 text-[oldlace]">
          {count !== null ? count : "..."}
        </p>
      </div>

      {/* অনুমোদনের অপেক্ষায় */}
      <div className="shadow-2xl rounded-2xl w-64 h-32 p-4 bg-[darkcyan]">
        <h2 className="text-xl font-bold text-[floralwhite]">অনুমোদনের অপেক্ষায়</h2>
        <p className="text-4xl font-semibold mt-2 ml-16 text-[oldlace]">
          {approvalPending !== null ? approvalPending : "..."}
        </p>
      </div>

      {/* মোট হোল্ডিং তথ্য */}
      <div className="shadow-2xl rounded-2xl w-60 h-32 p-4 bg-emerald-600">
        <h2 className="text-xl font-bold text-white">মোট হোল্ডিং</h2>
        <p className="text-4xl font-semibold mt-2 text-white">
          {holdingCount !== null ? holdingCount : "..."}
        </p>
      </div>

      {/* মোট হোল্ডিং তথ্য */}
      <div className="shadow-2xl rounded-2xl w-60 h-32 p-4 bg-emerald-600">
        <h2 className="text-xl font-bold text-white">মোট হোল্ডিং</h2>
        <p className="text-4xl font-semibold mt-2 text-white">
          {holdingCount !== null ? holdingCount : "..."}
        </p>
      </div>
    </div>
  );
}
