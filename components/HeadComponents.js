"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [headerData, setHeaderData] = useState({
    union_name: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/office_settings");
        const data = await res.json();
        if (data.success && data.settings.length > 0) {
          const setting = data.settings[0];
          setHeaderData({
            union_name: setting.union_name,
            imageUrl: setting.imageUrl,
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <main className="p-1 mt-1 bg-whitesmoke rounded-lg mx-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-2 bg-gradient-to-r from-[#fff8f5] to-[#f5e8e1] rounded-xl shadow-lg border border-brown-700">
        {/* Left Section: ইউনিয়নের লোগো */}
        <div className="w-32 h-32 flex-shrink-0 rounded-full overflow-hidden shadow-xl border-4 border-[#A52A2A]">
          <Image
            src={headerData.imageUrl || "/images/union2.png"}
            alt="Union Logo"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>

        {/* Center Section: ইউনিয়নের নাম, স্লোগান */}
        <div className="text-center flex-1 px-4">
          <h1
            style={{ color: "#A52A2A" }}
            className="text-4xl font-extrabold mb-2 tracking-wide drop-shadow-md"
          >
            {headerData.union_name || ""}
          </h1>
          <p className="text-2xl font-extrabold italic text-green-800 drop-shadow-sm mb-1">
            স্মার্ট সেবা
          </p>
          <p className="text-lg font-bold text-blue-800 drop-shadow-xs">
            সকল সেবা এক জায়গায়
          </p>
        </div>

        {/* Right Section: future buttons */}
        <div className="space-x-3">
          {/* Example buttons */}
          {/* 
          <a href="/certificates_open" className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition duration-200">
            সনদের আবেদন
          </a>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition duration-200">
            Login
          </a>
          */}
        </div>
      </div>
    </main>
  );
}
