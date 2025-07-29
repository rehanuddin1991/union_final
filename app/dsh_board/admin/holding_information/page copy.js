'use client'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function HoldingPage() {
  const [form, setForm] = useState({
    headName: '',
    ward: '',
    holdingNo: '',
    father: '',
    mother: '',
    nid: '',
    mobile: '',
    dob: '',
    gender: 'MALE',
    occupation: '',
    maleMembers: 0,
    femaleMembers: 0,
    othersMembers: 0,
    maleBaby: 0,
    femaleBaby: 0,
    othersBaby: 0,
    address: '',
    area: '',
    multiStoriedRoom: 0,
    buildingRoom: 0,
    semiBuildingRoom: 0,
    ownHouseRent: 0,
    othersRent: 0,
    imposedTax: 0,
  })
  const [holdings, setHoldings] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false);

  const fetchHoldings = async () => {
    const res = await fetch('/api/holding')
    const data = await res.json()
    setHoldings(data.holdings || [])
  }

  useEffect(() => {
    fetchHoldings()
  }, [])


  

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `/api/holding?id=${editingId}` : '/api/holding'

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
          headName: '',
          ward: '',
          holdingNo: '',
          father: '',
          mother: '',
          nid: '',
          mobile: '',
          dob: '',
          gender: 'MALE',
          occupation: '',
          maleMembers: 0,
          femaleMembers: 0,
          othersMembers: 0,
          maleBaby: 0,
          femaleBaby: 0,
          othersBaby: 0,
          address: '',
          area: '',
          multiStoriedRoom: 0,
          buildingRoom: 0,
          semiBuildingRoom: 0,
          ownHouseRent: 0,
          othersRent: 0,
          imposedTax: 0,
        })
        setEditingId(null)
        fetchHoldings()
      } else {
        toast.error('Failed')
      }
    } catch (err) {
      toast.error('Error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Confirm delete?')) return
    const res = await fetch(`/api/holding?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast.success('Deleted')
      fetchHoldings()
    }
  }

  const handleEdit = (h) => {
    setForm({ ...h, dob: h.dob?.substring(0, 10) }) // format dob
    setEditingId(h.id)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
     <form
  onSubmit={handleSubmit}
  className="bg-white border border-gray-300 p-6 sm:p-8 rounded-2xl shadow-lg mb-8 transition-shadow duration-300 hover:shadow-xl"
>
  <h2 className="text-2xl font-bold mb-6 text-darkcyan">
    {editingId ? "✏️ আপডেট হোল্ডিং" : "📝 নতুন হোল্ডিং"}{" "}
    <span className="text-red-600 text-base font-normal">
      (সকল সংখ্যা ইংরেজিতে পূরণ করুন) একটি হোল্ডিং শুধু  একবার এন্ট্রি হবে।
    </span>
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    {/* মালিকের নাম */}
    <div>
      <label htmlFor="headName" className="block mb-2 font-semibold text-darkcyan">
        মালিকের নাম <span className="text-red-600">*</span>
      </label>
      <input
        id="headName"
        placeholder="মালিকের নাম"
        value={form.headName}
        onChange={(e) => setForm({ ...form, headName: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
        required
      />
    </div>

    {/* ওয়ার্ড */}
    <div>
      <label htmlFor="ward" className="block mb-2 font-semibold text-darkcyan">
        ওয়ার্ড <span className="text-red-600">*</span>
      </label>
      <select
        id="ward"
        value={form.ward}
        onChange={(e) => setForm({ ...form, ward: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
        required
      >
        <option value="">ওয়ার্ড নির্বাচন করুন</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>

    

    {/* পিতা */}
    <div>
      <label htmlFor="father" className="block mb-2 font-semibold text-darkcyan">
        পিতা <span className="text-red-600">*</span>
      </label>
      <input
        id="father"
        placeholder="পিতা"
        value={form.father}
        onChange={(e) => setForm({ ...form, father: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
        required
      />
    </div>

    {/* মাতা */}
    <div>
      <label htmlFor="mother" className="block mb-2 font-semibold text-darkcyan">
        মাতা <span className="text-red-600">*</span>
      </label>
      <input
        id="mother"
        placeholder="মাতা"
        value={form.mother}
        onChange={(e) => setForm({ ...form, mother: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
        required
      />
    </div>

     {/* জন্ম তারিখ */}
    <div>
      <label htmlFor="dob" className="block mb-2 font-semibold text-darkcyan">
        জন্ম তারিখ
      </label>
      <input
        id="dob"
        type="date"
        placeholder="জন্ম তারিখ"
        value={form.dob}
        onChange={(e) => setForm({ ...form, dob: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* লিঙ্গ */}
    <div>
      <label htmlFor="gender" className="block mb-2 font-semibold text-darkcyan">
        লিঙ্গ
      </label>
      <select
        id="gender"
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      >
        <option value="MALE">পুরুষ</option>
        <option value="FEMALE">মহিলা</option>
        <option value="OTHER">অন্যান্য</option>
      </select>
    </div>

    {/* পেশা */}
    <div>
      <label htmlFor="occupation" className="block mb-2 font-semibold text-darkcyan">
        পেশা
      </label>
      <input
        id="occupation"
        placeholder="পেশা"
        value={form.occupation}
        onChange={(e) => setForm({ ...form, occupation: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* হোল্ডিং নং */}
    <div>
      <label htmlFor="holdingNo" className="block mb-2 font-semibold text-darkcyan">
        হোল্ডিং নং <span className="text-red-600">*</span>
      </label>
      <input
        id="holdingNo"
        placeholder="হোল্ডিং নং"
        value={form.holdingNo}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) setForm({ ...form, holdingNo: value });
        }}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
        required
      />
    </div>

    {/* NID */}
    <div>
      <label htmlFor="nid" className="block mb-2 font-semibold text-darkcyan">
        NID <span className="text-red-600">(*ইংরেজি সংখ্যা)</span>
      </label>
      <input
        id="nid"
        placeholder="NID"
        value={form.nid}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) setForm({ ...form, nid: value });
        }}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
        required
      />
    </div>

    {/* মোবাইল */}
    <div>
      <label htmlFor="mobile" className="block mb-2 font-semibold text-darkcyan">
        মোবাইল
      </label>
      <input
        id="mobile"
        placeholder="মোবাইল"
        value={form.mobile}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

   

    {/* পুরুষ সদস্য */}
    <div>
      <label
        htmlFor="maleMembers"
        className="block mb-2 font-semibold text-darkcyan"
      >
        পুরুষ সদস্য
      </label>
      <input
        id="maleMembers"
        type="number"
        placeholder="পুরুষ সদস্য"
        value={form.maleMembers}
        onChange={(e) => setForm({ ...form, maleMembers: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* মহিলা সদস্য */}
    <div>
      <label
        htmlFor="femaleMembers"
        className="block mb-2 font-semibold text-darkcyan"
      >
        মহিলা সদস্য
      </label>
      <input
        id="femaleMembers"
        type="number"
        placeholder="মহিলা সদস্য"
        value={form.femaleMembers}
        onChange={(e) => setForm({ ...form, femaleMembers: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* অন্যান্য সদস্য */}
    <div>
      <label
        htmlFor="othersMembers"
        className="block mb-2 font-semibold text-darkcyan"
      >
        অন্যান্য সদস্য
      </label>
      <input
        id="othersMembers"
        type="number"
        placeholder="অন্যান্য সদস্য"
        value={form.othersMembers}
        onChange={(e) => setForm({ ...form, othersMembers: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* পুরুষ শিশু */}
    <div>
      <label htmlFor="maleBaby" className="block mb-2 font-semibold text-darkcyan">
        পুরুষ শিশু
      </label>
      <input
        id="maleBaby"
        type="number"
        placeholder="পুরুষ শিশু"
        value={form.maleBaby}
        onChange={(e) => setForm({ ...form, maleBaby: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* মহিলা শিশু */}
    <div>
      <label
        htmlFor="femaleBaby"
        className="block mb-2 font-semibold text-darkcyan"
      >
        মহিলা শিশু
      </label>
      <input
        id="femaleBaby"
        type="number"
        placeholder="মহিলা শিশু"
        value={form.femaleBaby}
        onChange={(e) => setForm({ ...form, femaleBaby: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* অন্যান্য শিশু */}
    <div>
      <label
        htmlFor="othersBaby"
        className="block mb-2 font-semibold text-darkcyan"
      >
        অন্যান্য শিশু
      </label>
      <input
        id="othersBaby"
        type="number"
        placeholder="অন্যান্য শিশু"
        value={form.othersBaby}
        onChange={(e) => setForm({ ...form, othersBaby: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* ঠিকানা */}
    <div>
      <label htmlFor="address" className="block mb-2 font-semibold text-darkcyan">
        ঠিকানা <span className="text-red-600">*</span>
      </label>
      <input
        id="address"
        placeholder="ঠিকানা"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
        required
      />
    </div>

    {/* বর্গফুট */}
    <div>
      <label htmlFor="area" className="block mb-2 font-semibold text-darkcyan">
        বর্গফুট
      </label>
      <input
        id="area"
        placeholder="বর্গফুট"
        value={form.area}
        onChange={(e) => setForm({ ...form, area: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* বহুতল কক্ষ */}
    <div>
      <label
        htmlFor="multiStoriedRoom"
        className="block mb-2 font-semibold text-darkcyan"
      >
        বহুতল কক্ষ
      </label>
      <input
        id="multiStoriedRoom"
        type="number"
        placeholder="বহুতল কক্ষ"
        value={form.multiStoriedRoom}
        onChange={(e) => setForm({ ...form, multiStoriedRoom: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* পাকা ঘরের কক্ষ */}
    <div>
      <label
        htmlFor="buildingRoom"
        className="block mb-2 font-semibold text-darkcyan"
      >
        পাকা ঘরের কক্ষ
      </label>
      <input
        id="buildingRoom"
        type="number"
        placeholder="পাকা ঘরের কক্ষ"
        value={form.buildingRoom}
        onChange={(e) => setForm({ ...form, buildingRoom: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* সেমি পাকা ঘরের কক্ষ */}
    <div>
      <label
        htmlFor="semiBuildingRoom"
        className="block mb-2 font-semibold text-darkcyan"
      >
        সেমি পাকা ঘরের কক্ষ
      </label>
      <input
        id="semiBuildingRoom"
        type="number"
        placeholder="সেমি পাকা ঘরের কক্ষ"
        value={form.semiBuildingRoom}
        onChange={(e) => setForm({ ...form, semiBuildingRoom: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* নিজস্ব ভাড়া (নিজে বসবাস) */}
    <div>
      <label
        htmlFor="ownHouseRent"
        className="block mb-2 font-semibold text-darkcyan"
      >
        নিজস্ব ভাড়া (নিজে বসবাস)
      </label>
      <input
        id="ownHouseRent"
        type="number"
        placeholder="নিজস্ব ভাড়া (নিজে বসবাস)"
        value={form.ownHouseRent}
        onChange={(e) => setForm({ ...form, ownHouseRent: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* অন্যান্য ভাড়া */}
    <div>
      <label
        htmlFor="othersRent"
        className="block mb-2 font-semibold text-darkcyan"
      >
        অন্যান্য ভাড়া
      </label>
      <input
        id="othersRent"
        type="number"
        placeholder="অন্যান্য ভাড়া"
        value={form.othersRent}
        onChange={(e) => setForm({ ...form, othersRent: +e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>

    {/* ধার্যকৃত কর */}
    <div>
      <label htmlFor="imposedTax" className="block mb-2 font-semibold text-darkcyan">
        ধার্যকৃত কর
      </label>
      <input
        id="imposedTax"
        type="number"
        placeholder="ধার্যকৃত কর"
        value={form.imposedTax}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) setForm({ ...form, imposedTax: value });
        }}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-darkcyan focus:border-darkcyan transition"
      />
    </div>
  </div>

  <button
    type="submit"
    className="mt-8 w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 rounded-xl shadow-lg transition-colors duration-300"
  >
    {editingId ? "✅ আপডেট করুন" : "✅ সংরক্ষণ করুন"}
  </button>
</form>



      {/* টেবিল */}
      <div className="bg-white border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📋 হোল্ডিং তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-2">নাম</th>
              <th className="border p-2">ওয়ার্ড</th>
              <th className="border p-2">হোল্ডিং</th>
              <th className="border p-2">মোবাইল</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => (
              <tr key={h.id}>
                <td className="border p-2">{h.headName}</td>
                <td className="border p-2">{h.ward}</td>
                <td className="border p-2">{h.holdingNo}</td>
                <td className="border p-2">{h.mobile}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(h)} className="text-blue-600 mr-2">✏️</button>
                  <button onClick={() => handleDelete(h.id)} className="text-red-600">🗑</button>
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
