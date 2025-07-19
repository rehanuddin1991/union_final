'use client'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function HoldingCollectionPage() {
  const [form, setForm] = useState({
    holdingInformationId: '',
    holdingNumber: '',
    fiscalYear: 'Y2025_2026',
    amount: '',
    paymentDate: '',
  })

  const [collections, setCollections] = useState([])
  const [holdings, setHoldings] = useState([]) // To load holding info list for selection
  const [editingId, setEditingId] = useState(null)

  const [holdingSearchTerm, setHoldingSearchTerm] = useState('') // search term for holdings filter

  // Fetch HoldingCollection list
  const fetchCollections = async () => {
    const res = await fetch('/api/holding_collection')
    const data = await res.json()
    if(data.success) setCollections(data.collections)
    else toast.error('Failed to load collections')
  }

  // Fetch Holding_Information list for dropdown
  const fetchHoldings = async () => {
    const res = await fetch('/api/holding')
    const data = await res.json()
    if(data.success) setHoldings(data.holdings)
    else toast.error('Failed to load holdings')
  }

  useEffect(() => {
    fetchCollections()
    fetchHoldings()
  }, [])

  // Filter holdings according to holdingSearchTerm (search by headName, ward, holdingNo)
  const filteredHoldings = holdings.filter(h => {
    const term = holdingSearchTerm.toLowerCase()
    return (
      h.headName.toLowerCase().includes(term) ||
      String(h.ward).includes(term) ||
      h.holdingNo.toLowerCase().includes(term)
    )
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `/api/holding_collection?id=${editingId}` : '/api/holding_collection'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(editingId ? 'Updated!' : 'Saved!')
        setForm({
          holdingInformationId: '',
          holdingNumber: '',
          fiscalYear: 'Y2025_2026',
          amount: '',
          paymentDate: '',
        })
        setEditingId(null)
        fetchCollections()
      } else {
        toast.error('Failed')
      }
    } catch (err) {
      toast.error('Error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Confirm delete?')) return
    const res = await fetch(`/api/holding_collection?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast.success('Deleted')
      fetchCollections()
    }
  }

  const handleEdit = (c) => {
    setForm({
      holdingInformationId: c.holdingInformationId,
      holdingNumber: c.holdingNumber,
      fiscalYear: c.fiscalYear,
      amount: c.amount,
      paymentDate: c.paymentDate ? c.paymentDate.substring(0, 10) : '',
    })
    setEditingId(c.id)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? '✏️ আপডেট হোল্ডিং কালেকশন' : '📝 নতুন হোল্ডিং কালেকশন'}</h2>

        {/* Search input for holdings */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="হোল্ডিং অনুসন্ধান করুন (নাম, ওয়ার্ড, নং)"
            value={holdingSearchTerm}
            onChange={e => setHoldingSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="holdingInformationId" className="block mb-1 font-medium">হোল্ডিং নির্বাচন করুন</label>
          <select
            id="holdingInformationId"
            value={form.holdingInformationId}
            onChange={e => setForm({ ...form, holdingInformationId: +e.target.value })}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">হোল্ডিং নির্বাচন করুন</option>
            {filteredHoldings.map(h => (
              <option key={h.id} value={h.id}>
                {h.headName} - ওয়ার্ড {h.ward} - হোল্ডিং নং {h.holdingNo}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="holdingNumber" className="block mb-1 font-medium">হোল্ডিং নাম্বার</label>
          <input
            id="holdingNumber"
            placeholder="হোল্ডিং নাম্বার"
            value={form.holdingNumber}
            onChange={e => setForm({ ...form, holdingNumber: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fiscalYear" className="block mb-1 font-medium">আর্থিক বছর</label>
          <select
            id="fiscalYear"
            value={form.fiscalYear}
            onChange={e => setForm({ ...form, fiscalYear: e.target.value })}
            className="border p-2 rounded w-full"
            required
          >
            <option value="Y2022_2023">২০২২-২০২৩</option>
            <option value="Y2023_2024">২০২৩-২০২৪</option>
            <option value="Y2024_2025">২০২৪-২০২৫</option>
            <option value="Y2025_2026">২০২৫-২০২৬</option>
            <option value="Y2026_2027">২০২৬-২০২৭</option>
            <option value="Y2027_2028">২০২৭-২০২৮</option>
            <option value="Y2028_2029">২০২৮-২০২৯</option>
            <option value="Y2029_2030">২০২৯-২০৩০</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block mb-1 font-medium">পরিমাণ</label>
          <input
            id="amount"
            type="number"
            placeholder="পরিমাণ"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: +e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="paymentDate" className="block mb-1 font-medium">পেমেন্ট তারিখ</label>
          <input
            id="paymentDate"
            type="date"
            value={form.paymentDate}
            onChange={e => setForm({ ...form, paymentDate: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          {editingId ? '✅ আপডেট করুন' : '✅ সংরক্ষণ করুন'}
        </button>
      </form>

      {/* টেবিল */}
      <div className="bg-white border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📋 হোল্ডিং কালেকশন তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-2">হোল্ডিং মালিক</th>
              <th className="border p-2">হোল্ডিং নাম্বার</th>
              <th className="border p-2">আর্থিক বছর</th>
              <th className="border p-2">পরিমাণ</th>
              <th className="border p-2">পেমেন্ট তারিখ</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {collections.map(c => (
              <tr key={c.id}>
                <td className="border p-2">{c.holdingInformation?.headName || '---'}</td>
                <td className="border p-2">{c.holdingNumber}</td>
                <td className="border p-2">{c.fiscalYear.replace('Y', '').replace('_', '-')}</td>
                <td className="border p-2">{c.amount}</td>
                <td className="border p-2">{c.paymentDate ? c.paymentDate.substring(0, 10) : ''}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-600 mr-2">✏️</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600">🗑</button>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4">কোনো কালেকশন পাওয়া যায়নি।</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  )
}
