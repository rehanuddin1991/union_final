'use client'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
 import { useRouter } from 'next/navigation';

 

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' })


   const handleSubmit = async (e) => {
    e.preventDefault();

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
  alert("Server returned invalid response");
  return;
}

if (res.ok) {
  const target = data.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user'; 
   
    console.log("✅ Login Success. Redirecting to:", target);
 window.location.href = target; 
       
  
   
} else {
  alert(data.message || "Login failed");
}
  };




   
  return (
    <>
    <form autoComplete='on' onSubmit={handleSubmit} className="max-w-md mx-auto p-6 mt-12 bg-white rounded-2xl shadow-md">
  <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">লগইন করুন</h2>

  <input
    type="email"
    placeholder="ইমেইল"
    value={form.email}
    onChange={e => setForm({ ...form, email: e.target.value })}
    className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
    required
  />

  <input
    type="password"
    placeholder="পাসওয়ার্ড"
    value={form.password}
    onChange={e => setForm({ ...form, password: e.target.value })}
    className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
    required
  />

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
  >
    লগইন
  </button>
</form>

<ToastContainer position="top-center" autoClose={3000} />


       
    </>
  )
}
