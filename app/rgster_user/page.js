'use client'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (value.trim().length < 3) return "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।"
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "সঠিক ইমেইল দিন।"
        break
      case 'password':
        if (value.length < 6) return "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
        break
      default:
        return ""
    }
    return ""
  }

  useEffect(() => {
    // সব ফিল্ড valid কিনা চেক
    const noErrors = Object.values(errors).every(err => err === "")
    const allFilled = Object.values(form).every(val => val.trim() !== "")
    setIsValid(noErrors && allFilled)
  }, [errors, form])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) {
      toast.error("ফর্মের সব ভুল ঠিক করুন।")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        toast.success("রেজিস্ট্রেশন সফল!")
        setForm({ name: '', email: '', password: '', role: 'USER' })
      } else {
        toast.error(data.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।")
      }
    } catch (error) {
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-8 mt-16 bg-white rounded-3xl shadow-lg border border-blue-200"
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">রেজিস্টার করুন</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="পূর্ণ নাম"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            disabled={loading}
            className="w-full p-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 text-gray-800 placeholder-blue-400 shadow-sm transition"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="ইমেইল"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            disabled={loading}
            className="w-full p-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 text-gray-800 placeholder-blue-400 shadow-sm transition"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="পাসওয়ার্ড"
            value={form.password}
            onChange={e => handleChange('password', e.target.value)}
            disabled={loading}
            className="w-full p-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 text-gray-800 placeholder-blue-400 shadow-sm transition"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <select
          value={form.role}
          onChange={e => handleChange('role', e.target.value)}
          disabled={loading}
          className="w-full p-4 mb-6 rounded-xl border border-blue-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm transition"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full text-white text-lg font-semibold py-3 rounded-xl transition duration-300 shadow-md ${
            !isValid || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-800 hover:bg-blue-900'
          }`}
        >
          {loading ? "⌛ প্রসেস হচ্ছে..." : "✅ রেজিস্টার"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}
