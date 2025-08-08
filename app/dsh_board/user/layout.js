"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "GET" });
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.replace("/secure-login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* ✅ Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center bg-blue-900 text-white p-4 shadow-lg">
        <h2 className="text-xl font-bold">🎓Smart Union</h2>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* ✅ Sidebar */}
      <aside
        className={`
    ${isMenuOpen ? "block" : "hidden"} 
    md:block 
    fixed top-0 left-0 
     
    w-72
    z-50 
        h-screen overflow-y-auto

    bg-gradient-to-b from-blue-900 to-blue-700 
    bg-blue-900
    text-white p-6 
    space-y-6 
    shadow-2xl 
    will-change-transform
  `}
      >
        <h2 className="hidden md:block text-2xl font-bold mb-8 bg-[darkcyan] shadow-lg rounded-3xl px-4 py-2">
          🎓Smart Union
        </h2>

        <nav className="space-y-3">
          <a
            href="/dsh_board/user"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            🏠 Dashboard
          </a>

          <a
            href="/dsh_board/user/holding_information"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📋 Holding Tax Information
          </a>

          <a
            href="/dsh_board/user/holding_collection"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📋 Holding Tax Collection
          </a>

          {/* <a href="/dsh_board/user/holding_cards" className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300">
            📋 All Holdings Cards
          </a> */}

          <a
            href="/api/generate-card"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📋 Generate Cards
          </a>

          <a
            href="/dsh_board/user/certificates"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📜 সকল সনদ
          </a>
          <a
            href="/dsh_board/user/heirship"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📜 ওয়ারিশ সনদ
          </a>

          <a
            href="/dsh_board/user/institutions"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            ⚙️ সব প্রতিষ্ঠানের তথ্য
          </a>

          <a
            href="/dsh_board/user/masterrole"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            🤲 মাস্টাররোল তৈরি
          </a>

          <a
            href="/dsh_board/user/poor"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            🤲 হতদরিদ্রের তালিকা
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          🔓 Logout
        </button>
      </aside>

      {/* ✅ Right Side Content */}
      <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto md:ml-64">
        {children}
      </main>
    </div>
  );
}
