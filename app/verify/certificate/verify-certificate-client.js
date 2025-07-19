'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyCertificateClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [certificate, setCertificate] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchCert = async () => {
      try {
        const res = await fetch(`/api/certificates?id=${id}`)
        const data = await res.json()
        if (data.success && data.certificates.length > 0) {
          setCertificate(data.certificates[0])
        } else {
          setError('সনদটি খুঁজে পাওয়া যায়নি বা এটি অবৈধ।')
        }
      } catch {
        setError('সার্ভারে ত্রুটি হয়েছে।')
      }
    }
    fetchCert()
  }, [id])

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-bold mb-4">সনদ যাচাই</h1>

      {error && <p className="text-red-600">{error}</p>}

      {certificate && (
        <div className="space-y-2">
          <p><strong>নাম:</strong> {certificate.applicantName}</p>
          <p><strong>জাতীয় পরিচয়পত্র:</strong> {certificate.nid}</p>
          <p><strong>জন্ম তারিখ:</strong> {certificate.birthDate?.substring(0, 10)}</p>
          <p><strong>ঠিকানা:</strong> {certificate.address}</p>
          <p className="text-green-700 font-semibold">✅ এই সনদটি সিস্টেমে পাওয়া গেছে এবং বৈধ।</p>
        </div>
      )}
    </div>
  )
}
