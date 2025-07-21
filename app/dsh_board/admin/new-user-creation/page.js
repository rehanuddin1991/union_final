'use client'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)

  // ফর্ম সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault()

    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `/api/register?id=${editingId}` : '/api/register'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(editingId ? 'Updated successfully!' : 'Registration successful!')
        setForm({ name: '', email: '', password: '', role: 'USER' })
        setEditingId(null)
        fetchUsers()
      } else {
        toast.error('Something went wrong.')
      }
    } catch (error) {
      toast.error('Something went wrong.')
    }
  }

  // ইউজার তালিকা আনা
  const fetchUsers = async () => {
    const res = await fetch('/api/register')
    const data = await res.json()
    setUsers(data.users || [])
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ডিলিট
  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete?")) return
    const res = await fetch(`/api/register?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast.success('Deleted successfully!')
      fetchUsers()
    } else {
      toast.error('Failed to delete.')
    }
  }

  // এডিট
  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role })
    setEditingId(user.id)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <form
  onSubmit={handleSubmit}
  className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 rounded-2xl shadow-2xl border border-blue-200 mb-8 transition-all duration-300 hover:shadow-blue-200/50"
>
  <h2 className="text-3xl font-extrabold mb-6 text-blue-800 drop-shadow-md">
    {editingId ? '✏️ আপডেট করুন' : '📝 রেজিস্টার করুন'}
  </h2>

  <input
    type="text"
    placeholder="পূর্ণ নাম"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    className="w-full p-3 mb-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-all duration-200"
    required
  />

  <input
    type="email"
    placeholder="ইমেইল"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    className="w-full p-3 mb-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-all duration-200"
    required
  />

  <input
    type="password"
    placeholder="পাসওয়ার্ড"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    className="w-full p-3 mb-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-all duration-200"
    required={!editingId}
  />

  <select
    value={form.role}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
    className="w-full p-3 mb-6 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-all duration-200"
  >
    <option value="USER">USER</option>
    <option value="ADMIN">ADMIN</option>
  </select>

  <button
    type="submit"
    className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white px-6 py-3 rounded-xl w-full font-semibold shadow-lg hover:shadow-blue-300 transition-all duration-300"
  >
    {editingId ? '✅Update' : '✅Register'}
  </button>
</form>

      {/* ইউজার তালিকা */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">👥 ইউজার তালিকা</h3>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 border">নাম</th>
              <th className="p-2 border">ইমেইল</th>
              <th className="p-2 border">রোল</th>
              <th className="p-2 border">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 mr-2">✏️</button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  )
}
