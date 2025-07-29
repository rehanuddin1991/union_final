'use client'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function HoldingCollectionPage() {
  const today = new Date().toISOString().split("T")[0];


  const [form, setForm] = useState({
    holdingInformationId: '',
    holdingNumber: '',
    fiscalYear: 'Y2025_2026',
    amount: '',
    currentAmount: '',
    dueAmount: '',
    comments: '',
    paymentDate: '',
  })

  const [collections, setCollections] = useState([])
  const [holdings, setHoldings] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [holdingSearchTerm, setHoldingSearchTerm] = useState('')

  const [loading, setLoading] = useState(false)  // loading state

  const fetchCollections = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/holding_collection')
      const data = await res.json()
      if (data.success) setCollections(data.collections)
      else toast.error('Failed to load collections')
    } catch {
      toast.error('Failed to load collections')
    }
    setLoading(false)
  }

  const fetchHoldings = async () => {
    try {
      const res = await fetch('/api/holding')
      const data = await res.json()
      if (data.success) setHoldings(data.holdings)
      else toast.error('Failed to load holdings')
    } catch {
      toast.error('Failed to load holdings')
    }
  }

  useEffect(() => {
    fetchCollections()
    fetchHoldings()
     if (!form.paymentDate) {
      setForm(prev => ({ ...prev, paymentDate: today }));
    }
  }, [])

  useEffect(() => {
  const current = parseFloat(form.currentAmount) || 0;
  const due = parseFloat(form.dueAmount) || 0;
  const total = current + due;
  setForm(prev => ({ ...prev, amount: total.toString() }));
}, [form.currentAmount, form.dueAmount]);

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
    setLoading(true)
    if (!form.holdingNumber || form.holdingNumber.trim() === "") {
          toast.error("হোল্ডিং অবশ্যই দিতে হবে");
          setLoading(false);
          return;
        }

        if (!form.amount || form.amount.trim() === "") {
          toast.error("মোট টাকার পরিমাণ অবশ্যই দিতে হবে");
          setLoading(false);
          return;
        }


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
          currentAmount: '',
          dueAmount: '',
          comments: '',
          paymentDate: today,
        })
        setEditingId(null)
        fetchCollections()
      } else {
        toast.error('Failed')
      }
    } catch (err) {
      toast.error('Error')
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Confirm delete?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/holding_collection?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Deleted')
        fetchCollections()
      }
    } catch {
      toast.error('Failed to delete')
    }
    setLoading(false)
  }

  const handleEdit = (c) => {
    setForm({
      holdingInformationId: c.holdingInformationId,
      holdingNumber: c.holdingNumber,
      fiscalYear: c.fiscalYear,
      amount: c.amount,
      currentAmount: c.currentAmount,
      dueAmount: c.dueAmount,
      comments: c.comments,
      paymentDate: c.paymentDate ? c.paymentDate.substring(0, 10) : '',
    })
    setEditingId(c.id)
  }

   const handleHoldingChange = (e) => {
    const selectedId = +e.target.value;
    const selectedHolding = filteredHoldings.find(h => h.id === selectedId);

    setForm({
      ...form,
      holdingInformationId: selectedId,
      holdingNumber: selectedHolding ? selectedHolding.holdingNo : '',
    });
  };


  return (
    <div className="max-w-5xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 p-6 rounded-xl shadow-md mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {editingId ? '✏️ আপডেট হোল্ডিং কালেকশন' : '📝 নতুন হোল্ডিং কালেকশন'}
        </h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="হোল্ডিং অনুসন্ধান করুন (নাম, ওয়ার্ড, নং)"
          value={holdingSearchTerm}
          onChange={e => setHoldingSearchTerm(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
          <div>
            <label htmlFor="holdingInformationId" className="block mb-1 font-medium text-gray-700">
              হোল্ডিং নির্বাচন করুন
            </label>
            <select
              id="holdingInformationId"
              value={form.holdingInformationId}
              // onChange={e => setForm({ ...form, holdingInformationId: +e.target.value })}
              onChange={handleHoldingChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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

          <div>
            <label htmlFor="holdingNumber" className="block mb-1 font-medium text-gray-700">
              হোল্ডিং নাম্বার<span className="text-red-600 text-xl ">*</span>
            </label>
            <input readOnly disabled
              id="holdingNumber"
              
              value={form.holdingNumber}
              onChange={e => setForm({ ...form, holdingNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="fiscalYear" className="block mb-1 font-medium text-gray-700">
              আর্থিক বছর<span className="text-red-600 text-xl ">*</span>
            </label>
            <select
              id="fiscalYear"
              value={form.fiscalYear}
              onChange={e => setForm({ ...form, fiscalYear: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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

          <div>
            <label htmlFor="currentAmount" className="block mb-1 font-medium text-gray-700">
              চলতি ট্যাক্স<span className="text-red-600 text-xl ">*</span>
            </label>
            <input
              id="currentAmount"
              type="number"
              placeholder="পরিমাণ"
              value={form.currentAmount}
              onChange={e => setForm({ ...form, currentAmount: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="dueAmount" className="block mb-1 font-medium text-gray-700">
              বকেয়া (যদি থাকে)
            </label>
            <input
              id="dueAmount"
              type="number"
              placeholder="পরিমাণ"
              value={form.dueAmount}
              onChange={e => setForm({ ...form, dueAmount: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
               
            />
          </div>

          <div>
            <label htmlFor="amount" className="block mb-1 font-medium text-gray-700">
              মোট টাকা
            </label>
            <input readOnly disabled
              id="amount"
              type="number"
              placeholder="পরিমাণ"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="paymentDate" className="block mb-1 font-medium text-gray-700">
              পেমেন্ট তারিখ<span className="text-red-600 text-xl ">*</span>
            </label>
            <input
              id="paymentDate"
              type="date"
              value={form.paymentDate}
              onChange={e => setForm({ ...form, paymentDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="comments" className="block mb-1 font-medium text-gray-700">
              মন্তব্য (যদি থাকে)
            </label>
            <input
              id="comments"
              type="text"
              value={form.comments}
              onChange={e => setForm({ ...form, comments: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold transition ${
            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } flex justify-center items-center gap-2`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {editingId ? '✅ আপডেট করুন' : '✅ সংরক্ষণ করুন'}
        </button>
      </form>

      {/* Collections Table */}
      <div className="bg-white border border-gray-300 p-4 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 হোল্ডিং কালেকশন তালিকা</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-600">লোড হচ্ছে...</div>
        ) : (
          <table className="w-full text-sm border-collapse border border-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">হোল্ডিং মালিক</th>
                <th className="border border-gray-300 p-2 text-left">হোল্ডিং নাম্বার</th>
                <th className="border border-gray-300 p-2 text-left">আর্থিক বছর</th>
                <th className="border border-gray-300 p-2 text-right">পরিমাণ</th>
                <th className="border border-gray-300 p-2 text-left">পেমেন্ট তারিখ</th>
                <th className="border border-gray-300 p-2 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {collections.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-600">
                    কোনো কালেকশন পাওয়া যায়নি।
                  </td>
                </tr>
              )}
              {collections.map(c => (
                <tr key={c.id} className="hover:bg-green-50 transition">
                  <td className="border border-gray-300 p-2">{c.holdingInformation?.headName || '---'}</td>
                  <td className="border border-gray-300 p-2">{c.holdingNumber}</td>
                  <td className="border border-gray-300 p-2">{c.fiscalYear.replace('Y', '').replace('_', '-')}</td>
                  <td className="border border-gray-300 p-2 text-right">{c.amount}</td>
                  <td className="border border-gray-300 p-2">{c.paymentDate ? c.paymentDate.substring(0, 10) : ''}</td>
                  <td className="border border-gray-300 p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Edit"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete"
                      title="Delete"
                      disabled={loading}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  )
}
