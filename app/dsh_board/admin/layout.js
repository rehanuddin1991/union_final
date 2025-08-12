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
    <div className="  flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
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
            href="/dsh_board/admin"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            🏠 Dashboard
          </a>

          <div className="space-y-1">
            <p className="font-semibold">👨‍🎓 User</p>
            <div className="ml-4 space-y-1 text-sm">
              <a
                href="/dsh_board/admin/new-user-creation"
                className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
              >
                🧾 User Management
              </a>
            </div>
          </div>

          <a
            href="/dsh_board/admin/employees"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            👷‍♂️ Employee Management
          </a>

          <a
            href="/dsh_board/admin/holding_information"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📋 Holding Tax Information
          </a>

          <a
            href="/dsh_board/admin/holding_collection"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📋 Holding Tax Collection
          </a>

          <a
            href="/dsh_board/admin/income-expenses"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            💰💸Income and Expense
          </a>

          <a
            href="/dsh_board/admin/income-expenses/report"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            💰💸 Income and Expense Report
          </a>

          {/* <a href="/dsh_board/admin/holding_cards" className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300">
            📋 All Holdings Cards
          </a> */}

          <a
            href="/api/generate-card"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📋 Generate Cards
          </a>

          <a
            href="/dsh_board/admin/certificates"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📜 সকল সনদ
          </a>

          <a
            href="/dsh_board/admin/heirship"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📜 ওয়ারিশ সনদ
          </a>

          <a
            href="/dsh_board/admin/approval"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📜 Open Certificate Approval
          </a>

          <a
            href="/dsh_board/admin/office_settings"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            ⚙️ Office Settings
          </a>

          <a
            href="/dsh_board/admin/institutions"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            ⚙️ সব প্রতিষ্ঠানের তথ্য
          </a>

          <a
            href="/dsh_board/admin/masterrole"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            🤲 মাস্টাররোল তৈরি
          </a>

          <a
            href="/dsh_board/admin/poor"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            🤲 হতদরিদ্রের তালিকা
          </a>

          <a
            href="/dsh_board/admin/projects"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📁 প্রকল্প ব্যবস্থাপনা
          </a>

          <a
            href="/daily_collection"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            📁 হোল্ডিং কালেকশন রিপোর্ট
          </a>

          <a
            href="/dsh_board/admin/login-history"
            className="block py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            🔐 Login History
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
