'use client'
import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function HoldingCardsPage() {
  const [holdings, setHoldings] = useState([])
  const [settings, setSettings] = useState([])
const fetchSettings = async () => {
    const res = await fetch('/api/office_settings')
    const data = await res.json()
    if (data.success) setSettings(data.settings)
    else toast.error('ডেটা লোড করতে ব্যর্থ হয়েছে')
  }
  useEffect(() => {
    const fetchHoldings = async () => {
      const res = await fetch('/api/holding')
      const data = await res.json()
      if (data.success) setHoldings(data.holdings)
    }
    fetchHoldings();
    fetchSettings();
  }, [])

  return (
   <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {holdings.map((h) => (
    <div
      key={h.id}
      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg p-6 transition hover:shadow-xl print:shadow-none"
    >
      <div className="mb-4 space-y-2 ">
        <h2 className="text-xl  text-[brown] font-bold text-center mb-1">{settings[0]?.union_name}</h2>
        <h2 className="text-xl mt-2 font-semibold text-center text-[blueviolet] mb-1"><u>স্মার্ট হোল্ডিং কার্ড</u></h2>
        <h2 className="mt-4 text-xl  text-[darkcyan] mb-1">{h.headName}</h2>
        
          <p className="text-sm text-[darkorchid]">হোল্ডিং নম্বর: <span className="font-medium">{h.holdingNo}</span></p>
          <p className="text-sm text-[blueviolet]">ওয়ার্ড: <span className="font-medium">{h.ward}</span></p>
        <p className="text-sm text-gray-600">পিতার নাম <span className="font-medium">{h.father}</span></p>
        <p className="text-sm text-gray-600">মাতার নাম <span className="font-medium">{h.mother}</span></p>
        <p className="text-sm text-gray-600">জাতীয় পরিচয়পত্র <span className="font-medium">{h.nid}</span></p>
      
        <p className="text-sm text-gray-600">ঠিকানা: <span className="font-medium">{h.address}</span></p>
         
      </div>

      <div className="flex justify-center mt-4">
        <QRCodeCanvas
          value={`${window.location.origin}/holding/info?id=${h.id}`}
          size={100}
        />
      </div>
    </div>
  ))}
</div>

  )
}
