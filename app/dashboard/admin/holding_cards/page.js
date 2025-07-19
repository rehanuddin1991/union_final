'use client'
import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function HoldingCardsPage() {
  const [holdings, setHoldings] = useState([])

  useEffect(() => {
    const fetchHoldings = async () => {
      const res = await fetch('/api/holding')
      const data = await res.json()
      if (data.success) setHoldings(data.holdings)
    }
    fetchHoldings()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {holdings.map((h) => (
        <div key={h.id} className="border rounded-xl p-4 shadow bg-white">
          <h2 className="text-lg font-bold">{h.headName}</h2>
          <p>হোল্ডিং নম্বর: {h.holdingNo}</p>
          <p>গ্রাম: {h.address}</p>
          <p>কর: {h.mobile} টাকা</p>

          <div className="mt-4">
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
