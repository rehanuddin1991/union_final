'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [settings, setSettings] = useState(null); // ✅ office_settings

  useEffect(() => {
     const fetchEmployees = async () => {
  try {
    const res = await fetch("/api/employees");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (data.success) {
      setEmployees(data.employees);
    } else {
      console.error("API returned unsuccessful response");
    }
  } catch (err) {
    console.error("Failed to fetch employees", err);
  }
};

 const fetchSettings = async () => {
      try {
        const res = await fetch("/api/office_settings");
        const data = await res.json();
        if (data.success && data.settings.length > 0) {
          setSettings(data.settings[0]); // প্রথম সেটিংটি নিচ্ছি
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };

    fetchEmployees();
    fetchSettings();


    
  }, []);

  return (
    <div className="  bg-gradient-to-br from-sky-200 via-indigo-200 to-purple-200 flex items-center justify-center p-10">
      <div className="flex flex-col md:flex-row flex-wrap gap-10 max-w-7xl w-full justify-center">
        {employees.map((emp, i) => (
          <div key={emp.id} className="card w-full md:w-96 bg-white shadow-xl border border-indigo-300 hover:shadow-indigo-600 transition-shadow duration-300 rounded-xl flex flex-col">
            <figure className="px-16 pt-4">
              <Image
                src={ `/images/${i + 1}.jpg` }
                width={200}
                height={200}
                alt={emp.name}
                priority  
                className="rounded-full shadow-lg border-4 border-indigo-300"
              />
            </figure>
            <div className="card-body flex flex-col items-center text-center p-8 flex-grow">
              <h2 className="card-title text-indigo-800 text-2xl font-extrabold mb-3">
                {emp.name}
              </h2>

              <h2 className="card-title text-indigo-800 text-2xl font-extrabold mb-3">
                 {emp.designation === "OFFICER_IN_CHARGE" ? "প্রশাসক" : ""}
                 {emp.designation === "ADMINISTRATIVE_OFFICER" ? "ইউপি প্রশাসনিক কর্মকর্তা" : ""}
                 {emp.designation === "ACCOUNTANT_COMPUTER_OPERATOR" ? "হিসাব সহকারী কাম কম্পিউটার অপারেটর" : ""}
              </h2>

              <h2 className="card-title text-indigo-800 text-xl font-extrabold mb-3">
                 {settings?.union_name  }  
              </h2>
              
              <h2 className="card-title text-indigo-800 text-xl font-extrabold mb-3">
                 {settings?.upazila } ,  {settings?.district  } 
              </h2>

               

               
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
