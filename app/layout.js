import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import HeadComponents from "@/components/HeadComponents"; // ✅ import component

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}
      >
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

     <HeadComponents />

        {children}
<footer className="bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-50 text-gray-800 py-6 mt-6 border-t border-gray-300 shadow-inner">
  <div className="max-w-5xl mx-auto text-center px-4">
    <p className="text-lg sm:text-base font-medium">
      © 2025 — 
      <span className="text-cyan-700 font-semibold mx-1">Rehan Uddin</span>
      <span className="text-sm text-gray-600">|</span>
      <span className="text-blue-700 font-semibold mx-1">Upazila ICT Officer,</span>
      <span className="text-sm text-gray-600">|</span>
      <span className="text-indigo-700 font-semibold mx-1">DoICT, Ramgarh, Khagrachari</span>
    </p>
    <p className="text-xl text-gray-500 mt-2">All rights reserved. Crafted with ❤️ for digital governance.</p>
  </div>
</footer>

      </body>
    </html>
  );
}
