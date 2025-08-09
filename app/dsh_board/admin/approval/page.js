"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function CertificateApprovalPage() {
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);

  // ✅ Certificates লোড  
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/certificates-open?entry_page=open");
      const data = await res.json();
      if (data.success) setCertificates(data.certificates);
      else toast.error("তথ্য লোড করতে ব্যর্থ");
    } catch (error) {
      toast.error("লোডিং সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // ✅ Update Approve Button
  const handleApprove = async (id) => {
    if (!confirm("আপনি কি অনুমোদন করতে চান?")) return;
    try {
      const res = await fetch(`/api/certificates-open?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_approved: true,
          is_deleted: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ অনুমোদন সম্পন্ন হয়েছে");
        fetchCertificates();
      } else {
        toast.error("❌ অনুমোদন ব্যর্থ");
      }
    } catch {
      toast.error("❌ এরর হয়েছে");
    }
  };


  const handleDelete = async (id) => {
  if (!confirm("আপনি কি এই সার্টিফিকেট ডিলিট করতে চান?")) return;
  try {
    const res = await fetch(`/api/certificates-open?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) {
      toast.success("🗑️ ডিলিট সম্পন্ন হয়েছে");
      fetchCertificates();
    } else {
      toast.error("❌ ডিলিট ব্যর্থ");
    }
  } catch {
    toast.error("❌ এরর হয়েছে");
  }
};

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">📋 অনুমোদনের অপেক্ষায় থাকা সার্টিফিকেট</h2>

      {loading && (
        <div className="text-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-green-700 text-sm mt-2">loading.........</p>
        </div>
      )}

      <div className="bg-white border p-4 rounded-xl shadow">
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
                 <th className="border p-2">টাইপ</th>
              <th className="border p-2">আবেদনকারীর নাম</th>
              <th className="border p-2">পিতা</th>
              <th className="border p-2">মাতা</th>
              <th className="border p-2">nid</th>
              <th className="border p-2">birth</th>
              <th className="border p-2">ঠিকানা</th>
             
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                 <td className="border p-2">{cert.type}</td>
                <td className="border p-2">{cert.applicantName}</td>
                <td className="border p-2">{cert.fatherName}</td>
                <td className="border p-2">{cert.motherName}</td>
                <td className="border p-2">{cert.nid}</td>
                <td className="border p-2">{cert.birth_no}</td>
                <td className="border p-2">{cert.address}</td>
               
                <td className="border p-4 text-center">
                  <button
                    onClick={() => handleApprove(cert.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-2xl rounded-md shadow-sm"
                  >
                    ✅ Approve
                  </button> &nbsp;&nbsp;

                    <button
                    onClick={() => handleDelete(cert.id)}
                    className="bg-[crimson] hover:bg-red-700 text-2xl text-white px-3 py-1 rounded-md shadow-sm"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  কোনো তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
}
