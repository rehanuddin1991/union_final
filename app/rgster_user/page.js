'use client'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' })

   const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
         setForm({ name: '', email: '', password: '', role: 'USER' })
        toast.success("Registration Successful!")
        // ফর্ম ক্লিয়ার করো
       
      } else {
        toast.error("Registration failed. Please try again.")
      }
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

 return (
    <>
      <form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto p-8 mt-16 bg-white rounded-3xl shadow-lg border border-blue-200"
>
  <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">রেজিস্টার করুন</h2>

  <input
    type="text"
    placeholder="পূর্ণ নাম"
    value={form.name}
    onChange={e => setForm({ ...form, name: e.target.value })}
    className="w-full p-4 mb-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 text-gray-800 placeholder-blue-400 shadow-sm transition"
    required
  />

  <input
    type="email"
    placeholder="ইমেইল"
    value={form.email}
    onChange={e => setForm({ ...form, email: e.target.value })}
    className="w-full p-4 mb-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 text-gray-800 placeholder-blue-400 shadow-sm transition"
    required
  />

  <input
    type="password"
    placeholder="পাসওয়ার্ড"
    value={form.password}
    onChange={e => setForm({ ...form, password: e.target.value })}
    className="w-full p-4 mb-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 text-gray-800 placeholder-blue-400 shadow-sm transition"
    required
  />

  <select
    value={form.role}
    onChange={e => setForm({ ...form, role: e.target.value })}
    className="w-full p-4 mb-6 rounded-xl border border-blue-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm transition"
  >
    <option value="USER">USER</option>
    <option value="ADMIN">ADMIN</option>
  </select>

  <button
    type="submit"
    className="w-full bg-blue-800 hover:bg-blue-900 text-white text-lg font-semibold py-3 rounded-xl transition duration-300 shadow-md"
  >
    ✅ রেজিস্টার
  </button>
</form>


      <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}
