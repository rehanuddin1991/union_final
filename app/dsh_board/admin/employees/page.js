"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function EmployeesPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    designation: "CHAIRMAN",
    order: "",
    notes: "",
    imageUrl: "",   // <-- ImageBB URL রাখার জন্য নতুন ফিল্ড
  });
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchEmployees = async () => {
  setLoading(true); // ✅ লোডিং শুরু
  try {
    const res = await fetch("/api/employees");
    const data = await res.json();
    if (data.success) setEmployees(data.employees);
    else toast.error("তথ্য লোড করতে ব্যর্থ");
  } catch (error) {
    toast.error("লোডিং সমস্যা হয়েছে");
  } finally {
    setLoading(false); // ✅ লোডিং শেষ
  }
};


  useEffect(() => {
    fetchEmployees();
  }, []);

  // ছবি সিলেক্ট করলে preview set হবে
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ImageBB API তে ছবি আপলোড করে URL ফেরত নেয়
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploading(false);
        return data.url; // ImageBB থেকে পাওয়া URL
      } else {
        setUploading(false);
        toast.error("ছবি আপলোড ব্যর্থ: " + data.message);
        return null;
      }
    } catch (err) {
      setUploading(false);
      toast.error("ছবি আপলোডে সমস্যা");
      return null;
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Required validation
  if (!form.name || form.name.trim() === "") {
    toast.error("নাম অবশ্যই দিতে হবে");
    setLoading(false);
    return;
  }
  if (!form.designation || form.designation.trim() === "") {
    toast.error("পদবী অবশ্যই দিতে হবে");
    setLoading(false);
    return;
  }
  if (
    form.order === "" || 
    form.order === null || 
    isNaN(Number(form.order))
  ) {
    toast.error("অর্ডার অবশ্যই একটি সংখ্যা হতে হবে");
    setLoading(false);
    return;
  }

  let imageUrl = form.imageUrl;
  if (imageFile) {
    const uploadedUrl = await uploadImage();
    if (!uploadedUrl) {
      setLoading(false);
      return;
    }
    imageUrl = uploadedUrl;
  }

  const method = editingId ? "PATCH" : "POST";
  const url = editingId ? `/api/employees?id=${editingId}` : "/api/employees";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl }),
    });
    const data = await res.json();

    if (data.success) {
      toast.success(editingId ? "আপডেট হয়েছে" : "সংরক্ষিত");
      setForm({
        name: "",
        mobile: "",
        email: "",
        designation: "CHAIRMAN",
        order: "",
        notes: "",
        imageUrl: "",
      });
      setEditingId(null);
      setImageFile(null);
      setPreview(null);
      fetchEmployees();
    } else toast.error("ব্যর্থ");
  } catch {
    toast.error("এরর হয়েছে");
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id) => {
    if (!confirm("আপনি কি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("ডিলিট হয়েছে");
      fetchEmployees();
    }
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      mobile: emp.mobile || "",
      email: emp.email || "",
      designation: emp.designation,
      order: emp.order || "",
      notes: emp.notes || "",
      imageUrl: emp.imageUrl || "",
    });
    setEditingId(emp.id);
    setPreview(emp.imageUrl || null);
    setImageFile(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
     <form
  onSubmit={handleSubmit}
  className="bg-gradient-to-br from-white via-green-50 to-green-100 p-8 rounded-2xl shadow-2xl border border-green-200 mb-8 transition-all duration-300 hover:shadow-green-200/50"
>
  <h2 className="text-3xl font-extrabold mb-6 text-green-800 drop-shadow-md">
    {editingId ? "✏️ আপডেট কর্মকর্তা" : "📝 নতুন কর্মকর্তা যোগ করুন"}
  </h2>

  {/* নাম */}
  <label className="block mb-1 font-medium text-green-700">নাম<span className="text-red-600 text-xl ">*</span></label>
  <input
    type="text"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    className="w-full p-3 mb-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition-all duration-200"
    required
  />

  {/* মোবাইল */}
  <label className="block mb-1 font-medium text-green-700">মোবাইল<span className="text-red-600 text-sm "> *(শুধু ইংরেজি সংখ্যা)</span></label>
   

  <input
  type="text"
  value={form.mobile}
  onChange={(e) => {
    const value = e.target.value;
    // ✅ শুধুমাত্র সংখ্যা (0-9) এবং সর্বোচ্চ 11 ডিজিট
    if (/^\d{0,11}$/.test(value)) {
      setForm({ ...form, mobile: value });
    }
  }}
  placeholder="01812462044"
  className="w-full p-3 mb-4 border border-green-200 rounded-xl 
             focus:ring-2 focus:ring-green-400 focus:outline-none 
             shadow-sm transition-all duration-200"
/>



  {/* ইমেইল */}
  <label className="block mb-1 font-medium text-green-700">ইমেইল</label>
  <input
    type="email"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    className="w-full p-3 mb-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition-all duration-200"
  />

  {/* পদবি */}
  <label className="block mb-1 font-medium text-green-700">পদবি<span className="text-red-600 text-xl ">*</span></label>
  <select
    value={form.designation}
    onChange={(e) => setForm({ ...form, designation: e.target.value })}
    className="w-full p-3 mb-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition-all duration-200"
  >
    <option value="OFFICER_IN_CHARGE">প্রশাসক</option>
    <option value="CHAIRMAN">চেয়ারম্যান</option>
    <option value="ADMINISTRATIVE_OFFICER">প্রশাসনিক কর্মকর্তা</option>
    <option value="ACCOUNTANT_COMPUTER_OPERATOR">
      হিসাব সহকারী কাম কম্পিউটার অপারেটর
    </option>
    <option value="UP_MEMBER">মেম্বার</option>
     <option value="ENTREPRENEUR">উদ্যোক্তা</option>
    <option value="GRAM_POLICE">গ্রাম পুলিশ</option>
   
    
    <option value="OTHERS">অন্যান্য</option>
  </select>

  {/* ক্রম */}
  <label className="block mb-1 font-medium text-green-700">ক্রম<span className="text-red-600 text-sm "> *(ইংরেজি সংখ্যা)</span></label>
  <input
  type="text" // ✅ number না, text ব্যবহার করব
  value={form.order}
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {  // ✅ কেবল 0-9 অনুমোদিত
      setForm({ ...form, order: value });
    }
  }}
  className="w-full p-3 mb-4 border border-green-200 rounded-xl 
             focus:ring-2 focus:ring-green-400 focus:outline-none 
             shadow-sm transition-all duration-200"
/>

  {/* নোটস */}
  <label className="block mb-1 font-medium text-green-700">নোটস</label>
  <textarea
    value={form.notes}
    onChange={(e) => setForm({ ...form, notes: e.target.value })}
    className="w-full p-3 mb-4 border border-green-200 rounded-xl h-28 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition-all duration-200"
  ></textarea>

  {/* ছবি আপলোড */}
  <label className="block mb-1 font-medium text-green-700">ছবি আপলোড</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="block w-full text-sm text-gray-700 
               file:mr-4 file:py-2 file:px-4 
               file:rounded-lg file:border-0
               file:text-sm file:font-semibold
               file:bg-green-600 file:text-white
               hover:file:bg-green-700 
               cursor-pointer transition-all duration-300 mb-4"
  />

  {preview && (
    <img
      src={preview}
      alt="Preview"
      className="mb-4 max-h-40 rounded-xl border object-contain shadow-sm"
    />
  )}

 <button
  type="submit"
  disabled={uploading || loading}
  className="w-full bg-gradient-to-r from-green-600 to-green-700 
             hover:from-green-700 hover:to-green-800 text-white 
             py-3 rounded-xl font-semibold shadow-lg 
             hover:shadow-green-300 transition-all duration-300 
             disabled:opacity-50"
>
  {uploading
    ? "⏳ ছবি আপলোড হচ্ছে..."
    : loading
    ? (editingId ? "⏳ আপডেট হচ্ছে..." : "⏳ সংরক্ষণ হচ্ছে...")
    : editingId
    ? "✅ আপডেট"
    : "✅ সংরক্ষণ করুন"}
</button>

</form>


      <div className="bg-white border p-4 rounded-xl shadow">
        {loading && (
  <div className="text-center my-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
    <p className="text-red-700 text-sm mt-2">loading.........</p>
  </div>
)}

        <h2 className="text-xl font-semibold mb-3">📋 কর্মকর্তার তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
               
              <th className="border p-2">নাম</th>
              <th className="border p-2">পদবি</th>
              <th className="border p-2">মোবাইল</th>
              <th className="border p-2">ইমেইল</th>
              <th className="border p-2">ক্রম</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                 
                <td className="border p-2">{emp.name}</td>

                <td className="border p-2">
                  {emp.designation === "OFFICER_IN_CHARGE" ? "প্রশাসক" : ""}
                  {emp.designation === "ADMINISTRATIVE_OFFICER"
                    ? "ইউপি প্রশাসনিক কর্মকর্তা"
                    : ""}
                  {emp.designation === "ACCOUNTANT_COMPUTER_OPERATOR"
                    ? "হিসাব সহকারী কাম কম্পিউটার অপারেটর"
                    : ""}
                  {emp.designation === "UP_MEMBER" ? "সদস্য" : ""}
                  {emp.designation === "GRAM_POLICE" ? "গ্রাম পুলিশ" : ""}
                  {emp.designation === "OTHERS" ? "অন্যান্য" : ""}
                  {emp.designation === "CHAIRMAN" ? "চেয়ারম্যান" : ""}
                  {emp.designation === "ENTREPRENEUR" ? "উদ্যোক্তা" : ""}
                </td>
                <td className="border p-2">{emp.mobile || "-"}</td>
                <td className="border p-2">{emp.email || "-"}</td>
                <td className="border p-2">{emp.order || "-"}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-600 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-red-600"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  কোনো তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
