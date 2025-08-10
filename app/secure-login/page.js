'use client'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation';
import jwtDecode from "jwt-decode";


export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // ✅ loading state
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
  const checkAuth = async () => {
    const res = await fetch("/api/check-auth");
    const data = await res.json();

    if (res.ok && data.auth) {
      if (data.role === "ADMIN") {
        router.push("/dsh_board/admin");
      } else if (data.role === "USER") {
        router.push("/dsh_board/user");
      }
    }
  };
  checkAuth();
}, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading

    // ✅ ফর্ম ভ্যালিডেশন
    if (!form.email || !form.password) {
      toast.error("সব ঘর পূরণ করুন");
      setLoading(false); 
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("সঠিক ইমেইল দিন");
      setLoading(false); 
      return;
    }
    if (form.password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      setLoading(false); 
      return;
    }



    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("JSON parse error:", err);
        toast.error("Server returned invalid response");
        return;
      }

      // if (res.ok) {
      //   const target = data.role === 'ADMIN' ? '/dsh_board/admin' : '/dsh_board/user';
      //   console.log("✅ Login Success. Redirecting to:", target);
      //   window.location.href = target;
      // } else {
      //   toast.error(data.message || "Login failed");
      // }
       if (res.ok) {
        toast.success("লগইন সফল!", { onClose: () => {
          const target = data.role === 'ADMIN' ? '/dsh_board/admin' : '/dsh_board/user';
          router.push(target);
        }});
      } else {
        toast.error(data.message || "লগইন ব্যর্থ");
        setLoading(false); 
      }
    } catch (err) {
      toast.error("Something went wrong!");
      setLoading(false); 
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <>
    <form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto p-10 mt-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl"
>
  <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-8">
    লগইন করুন
  </h2>

  {/* Email */}
  <input
    type="email"
    placeholder="ইমেইল"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    autoComplete="email"
    required
    disabled={loading}
    className="w-full p-3 mb-5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 placeholder-gray-400 shadow-sm transition-all"
  />

  {/* Password */}
  <div className="relative mb-6">
    <input
      type={showPass ? "text" : "password"}
      placeholder="পাসওয়ার্ড"
      value={form.password}
      autoComplete="current-password"
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      required
      disabled={loading}
      className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 placeholder-gray-400 shadow-sm transition-all"
    />
    <span
      onClick={() => setShowPass(!showPass)}
      className="absolute right-4 top-3 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
    >
      {showPass ? "Hide" : "Show"}
    </span>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-600 to-purple-500 hover:from-purple-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg"
    }`}
  >
    {loading ? "লগইন হচ্ছে..." : "Login"}
  </button>
</form>


      <ToastContainer position="top-center" autoClose={100} />

       
    </>
  );
}
