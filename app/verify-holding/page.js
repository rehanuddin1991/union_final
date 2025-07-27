"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

export const dynamic = "force-dynamic";

function VerifyHoldingContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return; // ✅ id না থাকলে API কল হবে না
    fetch(`/api/holding?id=${id}`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [id]);

  if (!data) return <p className="p-4 text-gray-600">⏳ ডাটা লোড হচ্ছে...</p>;

  if (!data.success || !data.holding) {
    return <p className="p-4 text-red-600">❌ কোনো তথ্য পাওয়া যায়নি</p>;
  }

  const holding = data.holding;

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold text-green-700 mb-2">
        ✅ Holding Verified
      </h1>
      <p>
        <strong>Owner:</strong> {holding.name}
      </p>
      <p>
        <strong>Ward:</strong> {holding.ward}
      </p>
      <p>
        <strong>Holding No:</strong> {holding.holding_no}
      </p>
      <p>
        <strong>Total Tax:</strong> {holding.total_tax} Tk
      </p>
    </div>
  );
}

export default function VerifyHolding() {
  return (
    <Suspense fallback={<p className="p-4 text-gray-600">⏳ লোড হচ্ছে...</p>}>
      <VerifyHoldingContent />
    </Suspense>
  );
}
