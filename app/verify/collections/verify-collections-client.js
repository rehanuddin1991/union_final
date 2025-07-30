'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyCollectionClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [collections, setCollections] = useState(null)
  const [error, setError] = useState(null)

  



  useEffect(() => {
  if (!id) return
  const fetchCert = async () => {
    try {
      const res = await fetch(`/api/holding-with-collection?id=${id}`)
      const json = await res.json()
      if (json.success && json.data) {
        const collection = json.data;

        setCollections(collection.holdingInformation)
      } else {
        setError('সনদটি খুঁজে পাওয়া যায়নি বা এটি অবৈধ।')
      }
    } catch {
      setError('সার্ভারে ত্রুটি হয়েছে।')
    }
  }
  fetchCert()
}, [id])


  const formatDobDate = (date) => {
    const data = date?.substring(0, 10).split("-");
    return `${data[2]}-${data[1]}-${data[0]}`;
  };

  const enToBnNumber = (str) => {
    const enDigits = ['0','1','2','3','4','5','6','7','8','9'];
    const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return str.replace(/[0-9]/g, (d) => bnDigits[enDigits.indexOf(d)]);
  };

  // let bnDob2 = '';
  // if (holding?.birthDate) {
  //   const dob2 = formatDobDate(holding.birthDate.substring(0, 10));
  //   const [day, month, year] = dob2.split("-");
  //   bnDob2 = `${enToBnNumber(day)}-${enToBnNumber(month)}-${enToBnNumber(year)}`;
  // }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-bold mb-4">সনদ যাচাই</h1>

      {error && <p className="text-red-600">{error}</p>}

      {collections && (
        <div className="space-y-2 text-[darkcyan]">
          <p><strong>হোল্ডিং নম্বর:</strong> {collections.holdingNo}</p>
          <p><strong>নাম:</strong> {collections.headName}</p>
          <p><strong>পিতার নাম:</strong> {collections.father}</p>
          <p><strong>মাতার নাম:</strong> {collections.mother}</p>
          <p><strong>জাতীয় পরিচয়পত্র:</strong> {collections.nid}</p>
          <p><strong>ওয়ার্ড:</strong> {collections.ward}</p>
          <p><strong>ওয়ার্ড:</strong> {collections.fiscalYear}</p>
                      
          <p><strong>ঠিকানা:</strong> {collections.address}</p>
          <p className="text-green-700 font-semibold">✅ এই সনদটি সিস্টেমে পাওয়া গেছে এবং সনদটি বৈধ।</p>
        </div>
      )}
    </div>
  )
}
