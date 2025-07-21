'use client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
  await fetch('/api/logout', { method: 'GET' });

  localStorage.removeItem('token');
  sessionStorage.clear();

  // ✅ Hard redirect to clear browser back cache
  window.location.replace('/secure-login');
};



  return (
    <div className="flex min-h-screen">
      {/* বাম পাশের মেনু */}
      <aside className="w-64 bg-blue-800 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-8">🎓 Union Admin</h2>
        <nav className="space-y-3">
          <a href="/dsh_board/admin" className="block hover:text-blue-300">
            🏠 Dashboard
          </a>

           

          <div className="space-y-1">
            <p className="font-semibold text-white">👨‍🎓 User</p>
            <div className="ml-4 space-y-1 text-sm">
              <a href="/dsh_board/admin/new-user-creation" className="block hover:text-blue-300">
                🧾  User Management
              </a>
            </div>
          </div>

          <a href="/dsh_board/admin/employees" className="block hover:text-blue-300">
              👷‍♂️ Employee Management
          </a>

          <a href="/dsh_board/admin/holding_information" className="block hover:text-blue-300">
            📋 Holding Tax Information
          </a>
          <a href="/dsh_board/admin/holding_collection" className="block hover:text-blue-300">
            📋 Holding Tax Collection
          </a>

          <a href="/dsh_board/admin/holding_cards" className="block hover:text-blue-300">
            📋 All Holdings Cards
          </a>


          <a href="/dsh_board/admin/certificates" className="block hover:text-blue-300">
            📜  সকল সনদ
          </a>
           
          <a href="/dsh_board/admin/office_settings" className="block hover:text-blue-300">
            ⚙️ Office Settings
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          🔓 Logout
        </button>
      </aside>

      {/* ডান পাশের children content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
