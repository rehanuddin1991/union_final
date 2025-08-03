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

        <footer className="bg-gray-100 text-gray-700 py-4 mt-6 border-t border-gray-300 shadow-inner">
          <div className="max-w-4xl mx-auto text-center text-xl sm:text-base">
            <p className="font-medium">
              ©2025 —
              <span className="text-[darkcyan] font-semibold"> Rehan Uddin</span>
              , Upazila ICT Officer, <span className="text-[blue] font-semibold">DoICT</span> . All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
