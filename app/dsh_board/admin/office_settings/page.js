'use client'
import { useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export const dynamic = 'force-dynamic';

export default function OfficeSettingsPage() {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: null,
    sarok_no: '',
    notes: '',
    union_name: '',
    upazila: '',
    district: '',
    imageUrl: '', // ✅ image URL field
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const fetchSettings = async () => {
  setLoading(true); // লোডিং শুরু
  try {
    const res = await fetch('/api/office_settings');
    const data = await res.json();
    if (data.success) {
      setSettings(data.settings);
    } else {
      toast.error('ডেটা লোড করতে ব্যর্থ হয়েছে');
    }
  } catch (error) {
    toast.error('এরর হয়েছে');
  } finally {
    setLoading(false); // লোডিং শেষ
  }
};

  useEffect(() => {
    fetchSettings()
  }, [])

  // ✅ Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  // ✅ Upload image to ImageBB
  const uploadImage = async () => {
    if (!imageFile) return null
    setUploading(true)

    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setUploading(false)
        return data.url
      } else {
        toast.error('ছবি আপলোড ব্যর্থ: ' + data.message)
        setUploading(false)
        return null
      }
    } catch {
      toast.error('ছবি আপলোডে সমস্যা হয়েছে')
      setUploading(false)
      return null
    }
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); // ⬅️ লোডিং শুরু

  const method = form.id ? 'PATCH' : 'POST';
  const url = form.id ? `/api/office_settings?id=${form.id}` : '/api/office_settings';

  let imageUrl = form.imageUrl;
  if (imageFile) {
    const uploaded = await uploadImage();
    if (!uploaded) {
      setLoading(false); // ⬅️ আপলোড ব্যর্থ হলে লোডিং বন্ধ
      return;
    }
    imageUrl = uploaded;
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, imageUrl }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success('সফলভাবে সংরক্ষণ হয়েছে');
      fetchSettings();
      setForm({
        id: null,
        sarok_no: '',
        notes: '',
        union_name: '',
        upazila: '',
        district: '',
        imageUrl: '',
      });
      setImageFile(null);
      setPreview(null);
    } else {
      toast.error('সেভ করতে সমস্যা হয়েছে');
    }
  } catch {
    toast.error('এরর হয়েছে');
  } finally {
    setLoading(false); // ⬅️ যেকোনো অবস্থায় লোডিং বন্ধ
  }
};


 const handleDelete = async (id) => {
  if (!confirm('ডিলিট নিশ্চিত করবেন?')) return;

  setLoading(true); // ✅ লোডিং শুরু

  try {
    const res = await fetch(`/api/office_settings?id=${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (data.success) {
      toast.success('সফলভাবে ডিলিট হয়েছে');
      fetchSettings(); // ডেটা রিফ্রেশ
    } else {
      toast.error('ডিলিট করতে ব্যর্থ');
    }
  } catch (error) {
    toast.error('সার্ভার এরর');
  } finally {
    setLoading(false); // ✅ লোডিং শেষ
  }
};


  const handleEdit = (s) => {
    setForm({
      id: s.id,
      sarok_no: s.sarok_no || '',
      notes: s.notes || '',
      union_name: s.union_name || '',
      upazila: s.upazila || '',
      district: s.district || '',
      imageUrl: s.imageUrl || '',
    })
    setPreview(s.imageUrl || null)
    setImageFile(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">অফিস সেটিংস</h2>

      <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow space-y-4 mb-8">
        {/* স্মারক নং */}
        <div>
          <label className="font-semibold">স্মারক নং<span className="text-red-600 text-xl ">*</span></label>
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
          <label className="font-semibold">ইউনিয়নের নাম<span className="text-red-600 text-xl ">*</span></label>
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
          <label className="font-semibold">উপজেলা<span className="text-red-600 text-xl ">*</span></label>
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
          <label className="font-semibold">জেলা<span className="text-red-600 text-xl ">*</span></label>
          <input
            type="text"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="খাগড়াছড়ি"  required
          />
        </div>

         <div>
          <label className="font-semibold">ওয়েবসাইটের নাম:<span className="text-red-600 text-xl ">*</span></label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="www.ramgarhup.khagracchari.gov.bd"  required
          />
        </div>

         

        {/* ছবি আপলোড */}
        <div>
          <label className="font-semibold">সিল <span className="text-red-600 text-sm ">(গোল সিল)*</span> </label>
          <input
          required={!form.id}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 
              cursor-pointer transition-all duration-300"
          />
          {preview && (
            <img
              src={preview}
              alt="লোগো"
              className="mt-4 max-h-40 rounded-xl border object-contain shadow"
            />
          )}
        </div>

        <button
  type="submit"
  className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center"
  disabled={loading}
>
  {loading ? (
    <>
      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
      সেভ হচ্ছে...
    </>
  ) : (
    form.id ? 'আপডেট করুন' : 'সেভ করুন'
  )}
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
  {loading ? (
    <div className="text-center my-6">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
      <p className="text-blue-600 font-medium">লোড হচ্ছে...</p>
    </div>
  ) : (
    <>
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
          {settings.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">
                কোনো তথ্য পাওয়া যায়নি।
              </td>
            </tr>
          ) : (
            settings.map((s) => (
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
                  <button onClick={() => handleEdit(s)} className="text-blue-600 text-2xl ">✏️</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 text-2xl">🗑</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  )}
</div>


      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  )
}
