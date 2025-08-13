"use client";
import { useEffect, useState } from "react";

export default function AdminHome() {
  const [typewise, setTypewise] = useState([]);
  const [openPageCount, setOpenPageCount] = useState(null);
  const [holdingCount, setHoldingCount] = useState(null);

  useEffect(() => {
  const fetchCounts = async () => {
    try {
      const res = await fetch("/api/certificates/dashboard-counts");
      // একবারে read করতে হবে
      const data = await res.json(); 

      if (data.success) {
        setTypewise(data.certificatesTypewise);
        setOpenPageCount(data.openPageCount);
        setHoldingCount(data.holdingCount);
      }
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  };

  fetchCounts();
}, []);


  return (
    <div className="flex flex-wrap gap-6 p-6 bg-gray-100">
      {/* Typewise certificate boxes */}
      {typewise.map((item, index) => (
        <Box key={index} title={`${item.type}`} value={item.count} bg="darkslateblue" />
      ))}

      {/* Open Page Certificate Box */}
      <Box title="Approval Pending" value={openPageCount} bg="darkcyan" />

      {/* Holding Box */}
      <Box title="হোল্ডিং" value={holdingCount} bg="blueviolet" />
    </div>
  );
}

// Generic Box Component
function Box({ title, value, bg }) {
  return (
    <div
      className="shadow-2xl rounded-2xl w-60 h-32 p-4 flex flex-col justify-center items-center"
      style={{ backgroundColor: bg }}
    >
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-4xl font-semibold text-white mt-2">
        {value !== null && value !== undefined ? value : "..."}
      </p>
    </div>
  );
}
