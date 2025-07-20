'use client'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function EmployeesPage() {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    designation: 'CHAIRMAN',
    order: '',
    notes: '',
  })
  const [employees, setEmployees] = useState([])
  const [editingId, setEditingId] = useState(null)

  const fetchEmployees = async () => {
    const res = await fetch('/api/employees')
    const data = await res.json()
    if (data.success) setEmployees(data.employees)
    else toast.error('তথ্য লোড করতে ব্যর্থ')
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `/api/employees?id=${editingId}` : '/api/employees'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(editingId ? 'আপডেট হয়েছে' : 'সংরক্ষিত')
        setForm({ name: '', mobile: '', email: '', designation: 'CHAIRMAN', order: '', notes: '' })
        setEditingId(null)
        fetchEmployees()
      } else toast.error('ব্যর্থ')
    } catch {
      toast.error('এরর হয়েছে')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি মুছে ফেলতে চান?')) return
    const res = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast.success('ডিলিট হয়েছে')
      fetchEmployees()
    }
  }

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      mobile: emp.mobile || '',
      email: emp.email || '',
      designation: emp.designation,
      order: emp.order || '',
      notes: emp.notes || '',
    })
    setEditingId(emp.id)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? '✏️ আপডেট কর্মকর্তা' : '📝 নতুন কর্মকর্তা যোগ করুন'}
        </h2>

        <label className="block mb-1">নাম</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 mb-4 rounded w-full" required />

        <label className="block mb-1">মোবাইল</label>
        <input type="text" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className="border p-2 mb-4 rounded w-full" />

        <label className="block mb-1">ইমেইল</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-2 mb-4 rounded w-full" />

        <label className="block mb-1">পদবি</label>
        <select value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="border p-2 mb-4 rounded w-full">
          <option value="OFFICER_IN_CHARGE">প্রশাসক</option>
          <option value="CHAIRMAN">চেয়ারম্যান</option>
          <option value="ADMINISTRATIVE_OFFICER">প্রশাসনিক কর্মকর্তা</option>
          <option value="ACCOUNTANT_COMPUTER_OPERATOR">হিসাব সহকারী কাম কম্পিউটার অপারেটর</option>
        </select>

        <label className="block mb-1">ক্রম</label>
        <input
          type="number"
          value={form.order}
          onChange={e => setForm({ ...form, order: +e.target.value })}
          className="border p-2 mb-4 rounded w-full"
        />

        <label className="block mb-1">নোটস</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="border p-2 mb-4 rounded w-full h-24"></textarea>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          {editingId ? '✅ আপডেট' : '✅ সংরক্ষণ করুন'}
        </button>
      </form>

      <div className="bg-white border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📋 কর্মকর্তার তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-2">নাম</th>
              <th className="border p-2">পদবি</th>
              <th className="border p-2">মোবাইল</th>
              <th className="border p-2">ইমেইল</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.designation}</td>
                <td className="border p-2">{emp.mobile || '-'}</td>
                <td className="border p-2">{emp.email || '-'}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(emp)} className="text-blue-600 mr-2">✏️</button>
                  <button onClick={() => handleDelete(emp.id)} className="text-red-600">🗑</button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr><td colSpan={5} className="text-center p-4">কোনো তথ্য পাওয়া যায়নি।</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  )
}
