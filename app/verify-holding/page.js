'use client';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyHolding() {
  const params = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/holding?id=${id}`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">✅ Holding Verified</h1>
      <p>Owner: {data.name}</p>
      <p>Ward: {data.ward}</p>
      <p>Holding No: {data.holding_no}</p>
      <p>Total Tax: {data.total_tax} Tk</p>
    </div>
  );
}
