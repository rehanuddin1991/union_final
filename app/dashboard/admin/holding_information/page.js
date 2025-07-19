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
      <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow mb-8">
  <h2 className="text-xl font-semibold mb-4">{editingId ? '✏️ আপডেট হোল্ডিং' : '📝 নতুন হোল্ডিং'}</h2>
  <div className="grid grid-cols-2 gap-4">
    
    <div>
      <label htmlFor="headName" className="block mb-1 font-medium">মালিকের নাম</label>
      <input
        id="headName"
        placeholder="মালিকের নাম"
        value={form.headName}
        onChange={e => setForm({ ...form, headName: e.target.value })}
        className="border p-2 rounded w-full"
        required
      />
    </div>

    <div>
  <label htmlFor="ward" className="block mb-1 font-medium">ওয়ার্ড</label>
  <select
    id="ward"
    value={form.ward}
    onChange={e => setForm({ ...form, ward: +e.target.value })}
    className="border p-2 rounded w-full"
    required
  >
    <option value="">ওয়ার্ড নির্বাচন করুন</option>
    {[1,2,3,4,5,6,7,8,9].map(num => (
      <option key={num} value={num}>{num}</option>
    ))}
  </select>
</div>


    <div>
      <label htmlFor="holdingNo" className="block mb-1 font-medium">হোল্ডিং নং</label>
      <input
        id="holdingNo"
        placeholder="হোল্ডিং নং"
        value={form.holdingNo}
        onChange={e => setForm({ ...form, holdingNo: e.target.value })}
        className="border p-2 rounded w-full"
        required
      />
    </div>

    <div>
      <label htmlFor="father" className="block mb-1 font-medium">পিতা</label>
      <input
        id="father"
        placeholder="পিতা"
        value={form.father}
        onChange={e => setForm({ ...form, father: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="mother" className="block mb-1 font-medium">মাতা</label>
      <input
        id="mother"
        placeholder="মাতা"
        value={form.mother}
        onChange={e => setForm({ ...form, mother: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="nid" className="block mb-1 font-medium">NID</label>
      <input
        id="nid"
        placeholder="NID"
        value={form.nid}
        onChange={e => setForm({ ...form, nid: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="mobile" className="block mb-1 font-medium">মোবাইল</label>
      <input
        id="mobile"
        placeholder="মোবাইল"
        value={form.mobile}
        onChange={e => setForm({ ...form, mobile: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="dob" className="block mb-1 font-medium">জন্ম তারিখ</label>
      <input
        id="dob"
        type="date"
        placeholder="জন্ম তারিখ"
        value={form.dob}
        onChange={e => setForm({ ...form, dob: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="gender" className="block mb-1 font-medium">লিঙ্গ</label>
      <select
        id="gender"
        value={form.gender}
        onChange={e => setForm({ ...form, gender: e.target.value })}
        className="border p-2 rounded w-full"
      >
        <option value="MALE">পুরুষ</option>
        <option value="FEMALE">মহিলা</option>
        <option value="OTHER">অন্যান্য</option>
      </select>
    </div>

    <div>
      <label htmlFor="occupation" className="block mb-1 font-medium">পেশা</label>
      <input
        id="occupation"
        placeholder="পেশা"
        value={form.occupation}
        onChange={e => setForm({ ...form, occupation: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="maleMembers" className="block mb-1 font-medium">পুরুষ সদস্য</label>
      <input
        id="maleMembers"
        type="number"
        placeholder="পুরুষ সদস্য"
        value={form.maleMembers}
        onChange={e => setForm({ ...form, maleMembers: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="femaleMembers" className="block mb-1 font-medium">মহিলা সদস্য</label>
      <input
        id="femaleMembers"
        type="number"
        placeholder="মহিলা সদস্য"
        value={form.femaleMembers}
        onChange={e => setForm({ ...form, femaleMembers: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="othersMembers" className="block mb-1 font-medium">অন্যান্য সদস্য</label>
      <input
        id="othersMembers"
        type="number"
        placeholder="অন্যান্য সদস্য"
        value={form.othersMembers}
        onChange={e => setForm({ ...form, othersMembers: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="maleBaby" className="block mb-1 font-medium">পুরুষ শিশু</label>
      <input
        id="maleBaby"
        type="number"
        placeholder="পুরুষ শিশু"
        value={form.maleBaby}
        onChange={e => setForm({ ...form, maleBaby: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="femaleBaby" className="block mb-1 font-medium">মহিলা শিশু</label>
      <input
        id="femaleBaby"
        type="number"
        placeholder="মহিলা শিশু"
        value={form.femaleBaby}
        onChange={e => setForm({ ...form, femaleBaby: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="othersBaby" className="block mb-1 font-medium">অন্যান্য শিশু</label>
      <input
        id="othersBaby"
        type="number"
        placeholder="অন্যান্য শিশু"
        value={form.othersBaby}
        onChange={e => setForm({ ...form, othersBaby: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="address" className="block mb-1 font-medium">ঠিকানা</label>
      <input
        id="address"
        placeholder="ঠিকানা"
        value={form.address}
        onChange={e => setForm({ ...form, address: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="area" className="block mb-1 font-medium">বর্গফুট</label>
      <input
        id="area"
        placeholder="বর্গফুট"
        value={form.area}
        onChange={e => setForm({ ...form, area: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="multiStoriedRoom" className="block mb-1 font-medium">বহুতল কক্ষ</label>
      <input
        id="multiStoriedRoom"
        type="number"
        placeholder="বহুতল কক্ষ"
        value={form.multiStoriedRoom}
        onChange={e => setForm({ ...form, multiStoriedRoom: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="buildingRoom" className="block mb-1 font-medium">পাকা ঘরের কক্ষ</label>
      <input
        id="buildingRoom"
        type="number"
        placeholder="পাকা ঘরের কক্ষ"
        value={form.buildingRoom}
        onChange={e => setForm({ ...form, buildingRoom: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="semiBuildingRoom" className="block mb-1 font-medium">সেমি পাকা ঘরের কক্ষ</label>
      <input
        id="semiBuildingRoom"
        type="number"
        placeholder="সেমি পাকা ঘরের কক্ষ"
        value={form.semiBuildingRoom}
        onChange={e => setForm({ ...form, semiBuildingRoom: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="ownHouseRent" className="block mb-1 font-medium">নিজস্ব ভাড়া(নিজে বসবাস)</label>
      <input
        id="ownHouseRent"
        type="number"
        placeholder="নিজস্ব ভাড়া(নিজে বসবাস)"
        value={form.ownHouseRent}
        onChange={e => setForm({ ...form, ownHouseRent: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="othersRent" className="block mb-1 font-medium">অন্যান্য ভাড়া</label>
      <input
        id="othersRent"
        type="number"
        placeholder="অন্যান্য ভাড়া"
        value={form.othersRent}
        onChange={e => setForm({ ...form, othersRent: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="imposedTax" className="block mb-1 font-medium">ধার্যকৃত কর</label>
      <input
        id="imposedTax"
        type="number"
        placeholder="ধার্যকৃত কর"
        value={form.imposedTax}
        onChange={e => setForm({ ...form, imposedTax: +e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

  </div>

  <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded mt-4">
    {editingId ? '✅ আপডেট করুন' : '✅ সংরক্ষণ করুন'}
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
