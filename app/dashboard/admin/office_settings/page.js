'use client'
import { useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function OfficeSettingsPage() {
  const [settings, setSettings] = useState([])
  const [form, setForm] = useState({
    id: null,
    sarok_no: '',
    notes: '',
    union_name: '',
    upazila: '',
    district: '',
     
  })

  const fetchSettings = async () => {
    const res = await fetch('/api/office_settings')
    const data = await res.json()
    if (data.success) setSettings(data.settings)
    else toast.error('ডেটা লোড করতে ব্যর্থ হয়েছে')
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = form.id ? 'PATCH' : 'POST'
    const url = form.id ? `/api/office_settings?id=${form.id}` : '/api/office_settings'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('সফলভাবে সংরক্ষণ হয়েছে')
        fetchSettings()
        setForm({
          id: null,
          sarok_no: '',
          notes: '',
          union_name: '',
          upazila: '',
          district: '',
           
        })
      } else toast.error('সেভ করতে সমস্যা হয়েছে')
    } catch {
      toast.error('এরর হয়েছে')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('ডিলিট নিশ্চিত করবেন?')) return
    const res = await fetch(`/api/office_settings?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast.success('সফলভাবে ডিলিট হয়েছে')
      fetchSettings()
    } else toast.error('ডিলিট করতে ব্যর্থ')
  }

  const handleEdit = (s) => {
    setForm({
      id: s.id,
      sarok_no: s.sarok_no || '',
      notes: s.notes || '',
      union_name: s.union_name || '',
      upazila: s.upazila || '',
      district: s.district || '',
       
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">অফিস সেটিংস</h2>

      <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow space-y-4 mb-8">
        {/* স্মারক নং */}
        <div>
          <label className="font-semibold">স্মারক নং</label>
          <input
            type="text"
            value={form.sarok_no}
            onChange={(e) => setForm({ ...form, sarok_no: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="৪৬.০০.৪৬৮০.০৭৬.২০২৫/"
            required
          />
        </div>

        {/* ইউনিয়ন নাম */}
        <div>
          <label className="font-semibold">ইউনিয়নের নাম</label>
          <input
            type="text"
            value={form.union_name}
            onChange={(e) => setForm({ ...form, union_name: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="১নং রামগড় ইউনিয়ন পরিষদ"  required
          />
        </div>

        {/* উপজেলা */}
        <div>
          <label className="font-semibold">উপজেলা</label>
          <input
            type="text"
            value={form.upazila}
            onChange={(e) => setForm({ ...form, upazila: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="রামগড়"  required
          />
        </div>

        {/* জেলা */}
        <div>
          <label className="font-semibold">জেলা</label>
          <input
            type="text"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="খাগড়াছড়ি"  required
          />
        </div>

         

        {/* টেক্সট এডিটর */}
        <div>
          <label className="font-semibold">চিঠির উপরের ফুল হেডিং লিখুন</label>
          <Editor
            apiKey="fg6rfz4onq5dx0irorid2gyjdbh9xdpg01k2kdcqk7594hd2"
            value={form.notes}
            init={{
              height: 200,
              menubar: false,
              directionality: 'ltr',
              plugins: 'lists link code preview',
              toolbar:
                'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | removeformat',
            }}
            onEditorChange={(content) => setForm({ ...form, notes: content })}
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {form.id ? 'আপডেট করুন' : 'সেভ করুন'}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={() => setForm({
              id: null,
              sarok_no: '',
              notes: '',
              union_name: '',
              upazila: '',
              district: '',
              letter_count: ''
            })}
            className="w-full mt-2 bg-gray-400 text-white py-2 rounded"
          >
            নতুন ফর্ম
          </button>
        )}
      </form>

      <div className="bg-white border p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-3">সেটিং তালিকা</h3>
        <table className="w-full text-sm border">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-2">স্মারক নং</th>
              <th className="border p-2">ইউনিয়ন</th>
              <th className="border p-2">উপজেলা</th>
              <th className="border p-2">জেলা</th>
              <th className="border p-2">চিঠি সংখ্যা</th>
              <th className="border p-2">নোটস</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {settings.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  কোনো তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
            {settings.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.sarok_no || '-'}</td>
                <td className="border p-2">{s.union_name || '-'}</td>
                <td className="border p-2">{s.upazila || '-'}</td>
                <td className="border p-2">{s.district || '-'}</td>
                <td className="border p-2">{s.letter_count || '-'}</td>
                <td className="border p-2">
                  <div dangerouslySetInnerHTML={{ __html: s.notes || '-' }} />
                </td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-600">✏️</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600">🗑</button>
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
