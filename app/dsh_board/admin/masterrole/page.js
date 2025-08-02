"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function MasterRolePage() {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form, setForm] = useState({
    type: "",
    name: "",
    father: "",
    mother: "",
    nid: "",
    mobile: "",
    ward: "",
    address: "",
    comments: "",
  });
  const [roleList, setRoleList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/masterrole");
      const json = await res.json();
      if (json.success) {
        setRoleList(json.data);
      } else {
        toast.error("তথ্য লোড করা যায়নি");
      }
    } catch (error) {
      toast.error("সার্ভার সমস্যা");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/masterrole?id=${editingId}` : "/api/masterrole";

    if (!form.name.trim()) {
      toast.error("নাম অবশ্যই দিতে হবে");
      return;
    }

    if (!form.father.trim()) {
      toast.error("পিতার নাম অবশ্যই দিতে হবে");
      return;
    }

    if (!form.address.trim()) {
      toast.error("ঠিকানা অবশ্যই দিতে হবে");
      return;
    }

    try {
      setSubmitLoading(true);
      const bodyData = editingId ? { ...form, id: editingId } : form;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "আপডেট হয়েছে" : "সংরক্ষিত");
        setForm({
          type: "",
          name: "",
          father: "",
          mother: "",
          nid: "",
          mobile: "",
          ward: "",
          address: "",
          comments: "",
        });
        setEditingId(null);
        fetchRoles();
      } else toast.error("ব্যর্থ");
    } catch {
      toast.error("এরর হয়েছে");
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("আপনি কি মুছে ফেলতে চান?") ) return;
    const res = await fetch(`/api/masterrole?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("ডিলিট হয়েছে");
      setForm({
      type: "",
      name: "",
      father: "",
      mother: "",
      nid: "",
      mobile: "",
      ward: "",
      address: "",
      comments: "",
    });
    setEditingId(null);
      fetchRoles();
    }
  };

  const handleEdit = (p) => {
    setForm({
      type: p.type || "",
      name: p.name || "",
      father: p.father || "",
      mother: p.mother || "",
      nid: p.nid || "",
      mobile: p.mobile || "",
      ward: p.ward || "",
      address: p.address || "",
      comments: p.comments || "",
    });
    setEditingId(p.id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white via-green-50 to-green-100 p-8 rounded-2xl shadow-xl border border-green-200 mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-800">
          {editingId ? "✏️ ভূমিকা আপডেট করুন" : "➕ নতুন Master Role"}
        </h2>
        <div>
            <label className="block font-medium text-green-700 mb-1" >সহযোগিতার শিরোনাম*</label>

        <select
  value={form.type}
  onChange={(e) =>
    setForm({ ...form, type: e.target.value })
  }
  className="w-full p-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm"
  required
>
  <option value="" disabled>
    -- নির্বাচন করুন --
  </option>
  <option value="ভিজিএফ">ভিজিএফ</option>
  <option value="দুর্যোগকালীন">দুর্যোগকালীন</option>
  <option value="শুকনো খাবার">শুকনো খাবার</option>
  <option value="জিআর চাল">জিআর চাল</option>
  <option value="বিশেষ সহযোগিতা">বিশেষ সহযোগিতা</option>
  <option value="অন্যান্য">অন্যান্য</option>
</select>
</div>

       {[
  { label: "নাম", name: "name", required: true },
  { label: "পিতার নাম", name: "father", required: true },
  { label: "মাতার নাম", name: "mother" },
  { label: "জাতীয় পরিচয়পত্র", name: "nid" },
  { label: "মোবাইল", name: "mobile" },
  { label: "ওয়ার্ড", name: "ward" },
  { label: "ঠিকানা", name: "address", required: true },
].map((field) => (
  <div key={field.name} className="mb-4">
    <label className="block font-medium text-green-700 mb-1">
      {field.label}
      {field.required && <span className="text-red-600"> *</span>}
    </label>
    <input
      type="text"
      value={form[field.name]}
      onChange={(e) => {
        const value = e.target.value;

        // ✅ শুধুমাত্র nid এবং mobile এর জন্য সংখ্যা অনুমোদন
        if (field.name === "nid" || field.name === "mobile") {
          if (/^\d*$/.test(value)) {
            setForm({ ...form, [field.name]: value });
          }
        } else {
          setForm({ ...form, [field.name]: value });
        }
      }}
      className="w-full p-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm"
      required={field.required}
      placeholder={
        field.name === "nid" || field.name === "mobile"
          ? "শুধু ইংরেজি সংখ্যা"
          : ""
      }
    />
  </div>
))}


        <label className="block font-medium text-green-700 mb-1">মন্তব্য</label>
        <textarea
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          className="w-full p-3 border border-green-200 rounded-xl h-24 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm mb-4"
        />

       <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all flex justify-center items-center"
          disabled={submitLoading}
        >
          {submitLoading
            ? "⏳ সংরক্ষণ হচ্ছে..."
            : editingId
            ? "✅ আপডেট"
            : "✅ সংরক্ষণ করুন"}
        </button>
      </form>

      <div className="bg-white border p-4 rounded-xl shadow">
         {loading ? (
  <div className="text-center my-4 ">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p className="text-red-600 text-sm mt-2">loading...................................</p>
  </div>
) : (
  <> 
        <h2 className="text-xl font-semibold mb-3">📋 Master Role তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-2">সহযোগিতা</th>
              <th className="border p-2">নাম</th>
              <th className="border p-2">পিতা</th>
              
              <th className="border p-2">মোবাইল</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(roleList) && roleList.length > 0 ? (
              roleList.map((p) => (
                <tr key={p.id}>
                   <td className="border p-2">{p.type || "-"}</td>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.father}</td>
                 
                  <td className="border p-2">{p.mobile || "-"}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2 text-2xl">✏️</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 text-2xl">🗑</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  কোনো তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </>
)}
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
