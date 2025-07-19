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

        <main className="p-4 bg-white shadow-md rounded-lg mx-4 my-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Left: Union Image */}
            <div className="w-32 h-32 flex-shrink-0 shadow-lg rounded-full overflow-hidden">
              <Image
                src="/images/union2.png"
                alt="Union Logo"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>

            {/* Center: Heading */}
            <div className="text-center flex-1">
              <h1 className="text-4xl font-extrabold text-green-500 mb-1 tracking-wide drop-shadow-sm">
                ১নং রামগড় ইউনিয়ন পরিষদ
              </h1>
              <p className="text-md text-green-600 italic">সকল সেবা এক জায়গায়</p>
            </div>

            {/* Right: Buttons */}
            <div className="space-x-3">
              <a
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition duration-200"
              >
                Register
              </a>
              <a
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition duration-200"
              >
                Login
              </a>
            </div>
          </div>
        </main>

        {children}

        <footer className="footer sm:footer-horizontal footer-center bg-gray-200 text-green-700 p-4 mt-4 shadow-inner">
          <aside>
            <p className="    text-xl text-center">
              Rehan Uddin, Upazila ICT OFFICER, DoICT © {new Date().getFullYear()} — All rights reserved
            </p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
