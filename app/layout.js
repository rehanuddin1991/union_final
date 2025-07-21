import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Union",
  description: "Union Parishad",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <main className="p-1 mt-1 bg-whitesmoke   rounded-lg mx-3 ">
          <div
  className="flex flex-col sm:flex-row items-center justify-between gap-6 p-2 bg-gradient-to-r from-[#fff8f5] to-[#f5e8e1] rounded-xl shadow-lg border border-brown-700"
>
  {/* Left Section: ইউনিয়নের লোগো ছবি */}
  <div className="w-32 h-32 flex-shrink-0 rounded-full overflow-hidden shadow-xl border-4 border-[#A52A2A]">
    <Image
      src="/images/union.png"
      alt="Union Logo"
      width={128}
      height={128}
      className="object-cover"
    />
  </div>

  {/* Center Section: ইউনিয়নের নাম, স্লোগান */}
  <div className="text-center flex-1 px-4">
    <h1
      style={{ color: "#A52A2A" }}
      className="text-4xl font-extrabold mb-2 tracking-wide drop-shadow-md"
    >
      ১নং রামগড় ইউনিয়ন পরিষদ
    </h1>
    <p className="text-2xl font-extrabold italic text-green-800 drop-shadow-sm mb-1">
      স্মার্ট সেবা
    </p>
    <p className="text-lg font-bold text-blue-800 drop-shadow-xs">
      সকল সেবা এক জায়গায়
    </p>
  </div>

  {/* Right Section: বাটনগুলো (প্রয়োজনে ব্যবহার করবেন) */}
  <div className="space-x-3">
    {/* <a
        href="/register"
        className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition duration-200"
      >
        Register
      </a> */}
    {/* <a
        href="/login"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition duration-200"
      >
        Login
      </a> */}
  </div>
</div>

        </main>

        {children}

        <footer className="bg-gray-100 text-gray-700 py-4 mt-6 border-t border-gray-300 shadow-inner">
  <div className="max-w-4xl mx-auto text-center text-sm sm:text-base">
    <p className="font-medium">
      ©2025 — 
      <span className="text-green-700 font-semibold"> Rehan Uddin</span>, 
      Upazila ICT Officer, DoICT. All rights reserved.
    </p>
  </div>
</footer>

      </body>
    </html>
  );
}
