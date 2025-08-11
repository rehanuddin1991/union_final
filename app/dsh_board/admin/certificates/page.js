"use client";
import { useEffect, useState, useRef } from "react";
import { Pencil } from "lucide-react"; // Lucide icon ব্যবহার করলে
//import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import {
  commonPrintStyles,
  taxTableStyles,
} from "@/utils_js/helpers/printStyles";

import {
  getHeaderSection,
  getHeaderSectionTrade,
  preloadImage,
  openPrintWindow,
  generateSignatureHTML,
  generateApplicantInfoRows,
} from "@/utils_js/helpers/printHelpers";

import dynamic from "next/dynamic";
import {
  enToBnNumber,
  convertToBanglaNumber,
  numberToBanglaWords,
  bnToEnNumber,
} from "@/utils_js/utils";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

export default function CertificatesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDisabled, setIsDisabled] = useState(true);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(false);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [search, setSearch] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [settings, setSettings] = useState(null);
  const [now, setNow] = useState(null);
  const [isEditingType, setIsEditingType] = useState(false); // নতুন state

  const fetchOfficeSettings = async () => {
    const res = await fetch("/api/office_settings");
    const data = await res.json();
    if (data.success) {
      setSettings(data.settings[0]);
      //console.log("dddddd" + data.settings[0]);
    } else toast.error("অফিস সেটিংস লোড করতে ব্যর্থ হয়েছে");
    
  };


  const handleCopy = async (id, type) => {
     
    if (!form.type || form.type.trim() === "") {
    toast.error("সনদের ধরণ নির্বাচন করুন! (পেজের শুরুতে আছে)");
    return;
  }
  const copyType=form.type.trim();
  //alert(copyType)

  // ✅ যদি form.type আর type একই হয় তাহলে কপি হবে না
  // if (form.type === type) {
  //   toast.error("একই ধরন কপি করা যাবে না! (ধরণ পরিবর্তন করুণ)");
  //   return;
  // }
  try {
    const res = await fetch("/api/certificates-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, copyType }), // type পাঠানো হচ্ছে
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Copied successfully!");
      fetchCertificates(); // তালিকা রিফ্রেশ
    } else {
      toast.error(data.error || "Failed to copy");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error copying data");
  }
};



  const handleLoadDefaultNote = (type) => {
    let defaultNote = "";

    if (type === 1) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 2) {
      defaultNote = `
      <p>তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা। সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি,
       তিনি জন্মসূত্রে বাংলাদেশী নাগরিক। উক্ত ব্যক্তির জন্ম/জাতীয় সনদসহ অন্যান্য সনদে ${
         form.applicantName || "আবেদনকারী"
       } পরিলক্ষিত হলেও, ভুলবশত তাঁর নামীয় কিছু কাগজপত্রে (ভূমি/অন্যান্য) ${
        form.applicantName || "আবেদনকারী"
      } লেখা আছে।  আমার জানামতে, ${form.applicantName || "আবেদনকারী"} ও ${
        form.applicantName || "আবেদনকারী"
      } একই ব্যক্তি। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 3) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন এবং তাঁর স্বভাব-চরিত্র ভালো। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 4) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন এবং তিনি স্বামী পরিত্যক্তা/বিধবা। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 5) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন। তিনি উল্লিখিত ঠিকানায় বসবাস করেন এবং ভোটার স্থানান্তরের জন্য তাঁর আবেদন সঠিক ও যৌক্তিক। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি। </p>
    `;
    } else if (type === 6) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন এবং তিনি অবিবাহিত। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 7) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন। তাঁর স্বামীর মৃত্যুর পর অদ্যাবধি তিনি দ্বিতীয়/পুনঃ বিবাহ বন্ধনে আবদ্ধ হন নাই। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 8) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন।  তিনি একজন দিনমজুর এবং তাঁর বার্ষিক আয় ৬০০০০/- (ষাট হাজার টাকা) মাত্র। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 9) {
      defaultNote = `
      <p> উল্লিখিত ব্যক্তি আমার সন্তান। তাকে বাংলাদেশ সেনা/পুলিশ/নৌ/বিমান/আনসার বাহিনীতে নিয়োগের জন্য স্ব-জ্ঞানে সম্মতি প্রদান করিলাম এবং আপনার সম্মুখে স্বাক্ষর প্রদান করিলাম। এই নিয়োগের ব্যাপারে আমার কিংবা আমার পরিবারের কোনো আপত্তি নাই।
      </p>
    `;
    } else if (type === 10) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন এবং তিনি একজন ভূমিহীন। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 11) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন এবং তিনি একজন বেকার। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    } else if (type === 12) {
      defaultNote = `
      <p> সংশ্লিষ্ট ওয়ার্ড সদস্যের প্রত্যয়ন সূত্রে জানতে পারি, তিনি উল্লিখিত ঠিকানার একজন স্থায়ী বাসিন্দা এবং জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপে জড়িত নন এবং তিনি সনাতন হিন্দু/বৌদ্ধ / খ্রিস্টান সম্প্রদায়ের অন্তর্ভুক্ত। <br> আমি তাঁর সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করি।</p>
    `;
    }

    setForm((prevForm) => ({
      ...prevForm,
      notes: defaultNote,
    }));
  };

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    if (data.success) setEmployees(data.employees);
    else toast.error("Failed to load employees");
  };
  const today = new Date().toISOString().substring(0, 10);
  const [form, setForm] = useState({
    id: null,
    type: "",
    applicantName: "",
    fatherName: "",
    motherName: "",
    spouse: "",
    birthDate: "",
    address: "",
    issuedDate: today,

    businessStartDate: today,
    mobile: "",
    tin: "",
    passport: "",
    nature: "",
    email: "",
    nid: "",
    birth_no: "",
    ward: "",
    mouza: "",
    post_office: "",
    holding_no: "",
    notes: "",
    letter_count: "",
    trade_name: "",
    trade_address: "",

    trade_fee: "",
    trade_capital_tax: "",
    trade_due: "",
    trade_vat: "",
    trade_total_tax: "",
    trade_type: "",
    fiscalYear: "Y2025_2026", // default
    fiscalYearEnd: "Y2025_2026", // default
  });
  useEffect(() => {
    const fee = parseInt(form.trade_fee) || 0;
    const capital = parseInt(form.trade_capital_tax) || 0;
    const due = parseInt(form.trade_due) || 0;
    const vat = parseInt(form.trade_vat) || 0;

    const total = fee + capital + due + vat;

    setForm((prev) => ({ ...prev, trade_total_tax: total.toString() }));
  }, [form.trade_fee, form.trade_capital_tax, form.trade_due, form.trade_vat]);

  const printRef = useRef();

  // Load all certificates

  const fetchCertificates = async () => {
    setLoading(true); // ✅ লোডিং শুরু
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      if (data.success) {
        setCertificates(data.certificates);
        setFilteredCollections(data.certificates);
      } else {
        toast.error("Failed to load certificates");
      }
    } catch (error) {
      toast.error("ডাটা লোডিং ব্যর্থ হয়েছে!");
    } finally {
      setLoading(false); // ✅ লোডিং শেষ
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchEmployees();
    fetchOfficeSettings();
    setNow(new Date().toLocaleDateString());
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    const filtered = certificates.filter(
      (c) =>
        (c.nid || "").toLowerCase().includes(s) ||
        (c.birth_no || "").toString().includes(s)
    );
    setFilteredCollections(filtered);
  }, [search, certificates]);

  const signer2 = employees[1] || {
    name: " ",
    designation: "প্রশাসনিক কর্মকর্তা",
    office1: "১নং রামগড় ইউনিয়ন পরিষদ",
    office2: " ",
    office3: " ",
    office4: "রামগড়, খাগড়াছড়ি",
  };

  const signer = employees[0] || {
    name: " ",
    designation: "দায়িত্বপ্রাপ্ত কর্মকর্তা",
    office1: "১নং রামগড় ইউনিয়ন পরিষদ",
    office2: " ",
    office3: " ",
    office4: "রামগড়, খাগড়াছড়ি",
  };

  const designationText =
    signer.designation === "OFFICER_IN_CHARGE"
      ? "দায়িত্বপ্রাপ্ত কর্মকর্তা"
      : "চেয়ারম্যান";

  const designationText2 = "ইউপি প্রশাসনিক কর্মকর্তা";

  const resetForm = () => {
    setForm({
      id: null,
      type: "",
      applicantName: "",
      fatherName: "",
      motherName: "",
      spouse: "", // ✅ spouse
      birthDate: "",
      address: "",
      issuedDate: today,
      businessStartDate: today,
      mobile: "",
      tin: "",
      passport: "",
      nature: "",
      email: "",
      nid: "",
      birth_no: "", // ✅ birth_no
      ward: "",
      mouza: "",
      post_office: "",
      holding_no: "",
      notes: "",
      trade_name: "",
      trade_address: "",

      trade_fee: "",
      trade_capital_tax: "",
      trade_due: "",
      trade_vat: "",
      trade_total_tax: "",
      trade_type: "",
      fiscalYear: "Y2025_2026", // default
      fiscalYearEnd: "Y2025_2026", // default
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ লোডিং শুরু
    setIsEditingType(false);

    // Required validation
    if (!form.applicantName || form.applicantName.trim() === "") {
      toast.error("নাম অবশ্যই দিতে হবে");
      setLoading(false);
      return;
    }

    if (!form.fatherName || form.fatherName.trim() === "") {
      toast.error("পিতার নাম অবশ্যই দিতে হবে");
      setLoading(false);
      return;
    }

    if (!form.motherName || form.motherName.trim() === "") {
      toast.error("মাতার নাম অবশ্যই দিতে হবে");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
    };

    const method = form.id ? "PATCH" : "POST";
    const url = form.id
      ? `/api/certificates?id=${form.id}`
      : "/api/certificates";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(form.id ? "Updated Successfully" : "Added Successfully");
        resetForm();
        fetchCertificates();
      } else {
        toast.error("Operation failed");
      }
    } catch {
      toast.error("Error Occurred");
    } finally {
      setLoading(false); // ✅ কাজ শেষে লোডিং বন্ধ
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ডিলিট নিশ্চিত করবেন? ভুলে ডিলিট হলে ডেটা রিকভারি সম্ভব"))
      return;

    setLoading(true); // ✅ পেজ ফ্রিজ শুরু

    try {
      const res = await fetch(`/api/certificates?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Deleted Successfully");
        setForm({
          id: null,
          type: "",
          applicantName: "",
          fatherName: "",
          motherName: "",
          spouse: "",
          birthDate: "",
          address: "",
          issuedDate: today,

          businessStartDate: today,
          mobile: "",
          tin: "",
          passport: "",
          nature: "",
          email: "",
          nid: "",
          birth_no: "",
          ward: "",
          mouza: "",
          post_office: "",
          holding_no: "",
          notes: "",
          letter_count: "",
          trade_name: "",
          trade_address: "",

          trade_fee: "",
          trade_capital_tax: "",
          trade_due: "",
          trade_vat: "",
          trade_total_tax: "",
          trade_type: "",
          fiscalYear: "Y2025_2026", // default
          fiscalYearEnd: "Y2025_2026", // default
        });
        fetchCertificates(); // ✅ ডেটা রিফ্রেশ
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error occurred");
    } finally {
      setLoading(false); // ✅ পেজ আনফ্রিজ
    }
  };

  const handleEdit = (cert) => {
    setIsEditingType(true);
    setForm({
      id: cert.id,
      type: cert.type,
      applicantName: cert.applicantName,
      fatherName: cert.fatherName || "",
      motherName: cert.motherName || "",
      spouse: cert.spouse || "",
      birthDate: cert.birthDate ? cert.birthDate.substring(0, 10) : "",
      address: cert.address || "",
      issuedDate: cert.issuedDate ? cert.issuedDate.substring(0, 10) : today,

      businessStartDate: cert.businessStartDate
        ? cert.businessStartDate.substring(0, 10)
        : today,
      mobile: cert.mobile || "",
      tin: cert.tin || "",
      passport: cert.passport || "",
      nature: cert.nature || "",

      nid: cert.nid || "",
      birth_no: cert.birth_no || "", // ✅ birth_no
      ward: cert.ward || "",
      mouza: cert.mouza || "",
      post_office: cert.post_office || "",
      holding_no: cert.holding_no || "",
      notes: cert.notes || "",
      trade_name: cert.trade_name || "",
      trade_address: cert.trade_address || "",
      email: cert.email || "",
      trade_fee: cert.trade_fee || "",
      trade_capital_tax: cert.trade_capital_tax || "",
      trade_due: cert.trade_due || "",
      trade_vat: cert.trade_vat || "",
      trade_total_tax: cert.trade_total_tax || "",
      trade_type: cert.trade_type || "",
      fiscalYear: cert.fiscalYear || "Y2025_2026",
      fiscalYearEnd: cert.fiscalYearEnd || "Y2025_2026",
    });
  };

  const formatDobDate = (date) => {
    const data = date?.substring(0, 10).split("-");
    return `${data[2]}-${data[1]}-${data[0]}`;
    if (!date || date.length !== 8) return date; // 8 digit হলে মনে করব yyyymmdd
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${day}-${month}-${year}`;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCollections.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);

  const handlePrint = async (cert) => {
    setLoading(true); // ⬅️ লোডিং শুরু
    try {
      const origin = window.location.origin;
      const dob = formatDobDate(cert.birthDate?.substring(0, 10));
      const [day, month, year] = dob.split("-");

      const bnDob = `${enToBnNumber(day)}-${enToBnNumber(month)}-${enToBnNumber(
        year
      )}`;
      const nid = enToBnNumber(cert.nid);
      const birth_no = enToBnNumber(cert.birth_no);
      const applicantInfoRows = generateApplicantInfoRows(
        cert,
        bnDob,
        nid,
        birth_no
      );
      const issue_date_format = formatDate(cert.issuedDate || new Date());
      const [issue_day, issue_month, issue_year] = issue_date_format.split("-");
      const bnIssueDate = `${enToBnNumber(issue_day)}-${enToBnNumber(
        issue_month
      )}-${enToBnNumber(issue_year)}`;

      const govtImg = `${origin}/images/govt.png`;
      const unionImg = settings?.imageUrl || `${origin}/images/union.png`;

      const qrImg = `${origin}/images/qr.png`;
      const qrUrl = `${origin}/verify/certificate?id=${cert.id}`;
      const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        qrUrl
      )}&size=100x100`;
      //const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=https://google.com&size=150x150`;

      // ✅ প্রিলোড ইমেজ
      try {
        await Promise.all([preloadImage(govtImg), preloadImage(unionImg)]);
      } catch (err) {
        console.error("Error preloading images:", err);
      }

      const cert_type = cert.type;

      const signatureHTML = generateSignatureHTML(
        signer,
        signer2,
        designationText,
        designationText2,
        settings,
        qrImg_with_link,
        cert_type
      );

      const headerHTML = getHeaderSection(settings, govtImg, unionImg);

      const printContents = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${cert.type || "Certificate"}</title>
       <style>
        ${commonPrintStyles.replace("__UNION_IMG__", unionImg)}
      </style>
    </head>
    <body>
      <div class="outer-border">
        <div class="middle-border">
          <div class="inner-border">
             

            ${headerHTML}

            <hr>

            <div class="top-section">
              <p>স্মারক নং: ${settings?.sarok_no}${enToBnNumber(
        cert?.letter_count
      )}</p>
              <p>তারিখ: ${bnIssueDate}</p>
            </div>

            <div style="border: 1px solid green;margin:auto; background-color: #e6f4ea; padding: 5px; margin-top: 15px; border-radius: 7px;
             width: 250px; text-align: center;">
  <h1 style="font-size: 21px; color: #000080; margin: auto;">
    ${cert.type || "সার্টিফিকেট"}
  </h1>
</div>



            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>প্রত্যয়ন করা যাচ্ছে যে,</b></p>

            <table>
  <tr>
    <td style="width: 30%;font-size:16px;font-weight:bold;">নাম</td>
    <td style="margin-left:20px;font-size:16px;font-weight:bold;">: ${
      cert.applicantName
    }</td>
  </tr>
   ${applicantInfoRows}
   
   
    
   
   
   
</table>

<table style="margin-top:-15px;">
  <tr>
        <td style="width:30%;font-size:17px;">ওয়ার্ড</td>
        <td style="width:38%;text-align:left;font-size:17px;">: &nbsp;${
          enToBnNumber(cert.ward) || "-"
        }</td>         
        <td style="width:14%;font-size:17px;">হোল্ডিং নং </td>
        <td style="width:18%;text-align:left;font-size:17px;">: &nbsp; ${
          enToBnNumber(cert.holding_no) || "-"
        }</td>          

  </tr>

    <tr>
        <td style="width:30%;font-size:17px;">গ্রাম</td>
        <td style="width:38%;text-align:left;font-size:17px;">:&nbsp;${
          cert.address || "-"
        }</td>
        
        <td style="width:14%;font-size:17px;">মৌজা</td>
        <td style="width:18%;text-align:left;font-size:17px;">: &nbsp;${
          enToBnNumber(cert.mouza) || "-"
        } </td>        

  </tr>


  <tr>
        <td style="width:30%;font-size:17px;">ডাকঘর</td>
        <td style="width:38%;text-align:left;font-size:17px;">:&nbsp;${
          enToBnNumber(cert.post_office) || "-"
        }</td>        
         
        <td colspan=2 style="width:32%;text-align:left;font-size:16px;">উপজেলা: ${
          settings?.upazila
        },
        জেলা: &nbsp;${settings?.district}</td>        

  </tr>



</table>

 

 



 




<div style="text-align:justify; line-height:1.6">  
    ${cert.notes || "-"}
</div>
${
  cert.type === "অভিভাবক সম্মতিপত্র"
    ? ` <br><br>
  <div style="margin-left:500px;">   
     অভিভাবকের স্বাক্ষর <br>
  </div>
`
    : ""
}

${
  cert.type === "নাগরিকত্ব সনদ"
    ? ` <br> 
   
`
    : ""
}

${
  cert.type === "জাতীয়তা সনদ"
    ? ` <br> 
   
`
    : ""
}


 

 
        

             ${signatureHTML}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

      openPrintWindow(printContents);
    } catch (error) {
      console.error("Printing failed:", error);
      toast.error("Printing failed");
    } finally {
      setLoading(false); // ⬅️ লোডিং বন্ধ
    }
  };

  const handlePrintNameRelated = async (cert, settings) => {
    const origin = window.location.origin;
    const dob = formatDobDate(cert.birthDate?.substring(0, 10));
    const [day, month, year] = dob.split("-");

    const bnDob = `${enToBnNumber(day)}-${enToBnNumber(month)}-${enToBnNumber(
      year
    )}`;
    const applicantInfoRows = generateApplicantInfoRows(cert, bnDob);
    const issue_date_format = formatDate(cert.issuedDate || new Date());
    const [issue_day, issue_month, issue_year] = issue_date_format.split("-");
    const bnIssueDate = `${enToBnNumber(issue_day)}-${enToBnNumber(
      issue_month
    )}-${enToBnNumber(issue_year)}`;

    const govtImg = `${origin}/images/govt.png`;
    const unionImg = settings?.imageUrl || `${origin}/images/union.png`;

    const qrImg = `${origin}/images/qr.png`;
    const qrUrl = `${origin}/verify/certificate?id=${cert.id}`;
    const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrUrl
    )}&size=100x100`;
    //const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=https://google.com&size=150x150`;

    // ✅ প্রিলোড ইমেজ
    try {
      await Promise.all([preloadImage(govtImg), preloadImage(unionImg)]);
    } catch (err) {
      console.error("Error preloading images:", err);
    }

    const signatureHTML = generateSignatureHTML(
      signer,
      signer2,
      designationText,
      designationText2,
      settings,
      qrImg_with_link,
      cert.type
    );

    const headerHTML = getHeaderSection(settings, govtImg, unionImg);

    const printContents = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${cert.type || "Certificate"}</title>
       <style>
        ${commonPrintStyles.replace("__UNION_IMG__", unionImg)}
      </style>
    </head>
    <body>
      <div class="outer-border">
        <div class="middle-border">
          <div class="inner-border">
             

            ${headerHTML}

            <hr>

            <div class="top-section">
              <p>স্মারক নং: ${settings?.sarok_no}${enToBnNumber(
      cert?.letter_count
    )}</p>
              <p>তারিখ: ${bnIssueDate}</p>
            </div>

            <div style="border: 1px solid green;margin:auto; background-color: #e6f4ea; padding: 5px; margin-top: 35px; border-radius: 7px;
             width: 250px; text-align: center;">
  <h1 style="font-size: 21px; color: #000080; margin: auto;">
    ${cert.type || "সার্টিফিকেট"}
  </h1>
</div>



           

            
<div style="text-align:justify; line-height:2.2;margin-top:32px;">  
 <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,&nbsp;${
   cert.applicantName
 },&nbsp; পিতা: ${cert.fatherName}, 
            মাতা: ${cert.motherName},</b>  
            জন্ম তারিখ: ${bnDob},</b>
            গ্রাম: ${cert.address}, ওয়ার্ড: ${cert.ward},&nbsp;${
      settings?.union_name
    }, ডাকঘর: ${cert.post_office},উপজেলা: ${settings?.upazila},
            জেলা: ${settings?.district} ।
            </p>
    <p>${cert.notes || "-"}</p>
</div>
 <br>
        

             ${signatureHTML}

             <br>
             <br>
             <br>
              
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

    openPrintWindow(printContents);
  };

  const handlePrint_trade = async (cert) => {
    const origin = window.location.origin;

    const dob = formatDobDate(cert.birthDate?.substring(0, 10));
    const [day, month, year] = dob.split("-");

    const bnDob = `${enToBnNumber(day)}-${enToBnNumber(month)}-${enToBnNumber(
      year
    )}`;
    const applicantInfoRows = generateApplicantInfoRows(cert, bnDob);

    const issue_date_format = formatDate(cert.issuedDate || new Date());
    const [issue_day, issue_month, issue_year] = issue_date_format.split("-");
    const bnIssueDate = `${enToBnNumber(issue_day)}-${enToBnNumber(
      issue_month
    )}-${enToBnNumber(issue_year)}`;

    const businessStDate = formatDate(cert.businessStartDate || new Date());
    const [issue_day22, issue_month22, issue_year22] =
      businessStDate.split("-");
    const bnStartDate = `${enToBnNumber(issue_day22)}-${enToBnNumber(
      issue_month22
    )}-${enToBnNumber(issue_year22)}`;

    const [startYear, endYear] = cert.fiscalYearEnd.split("_");
    const [fiscal_start, fiscal_end_bk] = cert.fiscalYear.split("_");
    const [fiscal_start_bk, fiscal_end] = cert.fiscalYearEnd.split("_");

    const st_formt_date = cert.fiscalYear.replace(/^Y/, "");
    const [fiscal_start_year, fiscal_end_year] = st_formt_date.split("_");

    const govtImg = `${origin}/images/govt.png`;
    const unionImg = settings?.imageUrl || `${origin}/images/union.png`;

    const qrImg = `${origin}/images/qr.png`;
    const qrUrl = `${origin}/verify/certificate?id=${cert.id}`;
    const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrUrl
    )}&size=100x100`;
    //const qrImg_with_link = `https://api.qrserver.com/v1/create-qr-code/?data=https://google.com&size=150x150`;

    // ✅ প্রিলোড ইমেজ
    try {
      await Promise.all([preloadImage(govtImg), preloadImage(unionImg)]);
    } catch (err) {
      console.error("Error preloading images:", err);
    }

    const signatureHTML = generateSignatureHTML(
      signer,
      signer2,
      designationText,
      designationText2,
      settings,
      qrImg_with_link,
      cert.type
    );
    const headerHTML = getHeaderSectionTrade(settings, govtImg, unionImg);

    const printContents = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${cert.type || "Certificate"}</title>
        <style>
        ${commonPrintStyles.replace("__UNION_IMG__", unionImg)}
        ${taxTableStyles}
      </style>
    </head>
    <body>
    <br><br> 
      <div class="outer-border">
        <div class="middle-border">
          <div class="inner-border">
             

          
            ${headerHTML}

            

            

            <div class="top-section"  style="margin-top:1px;">
              <p>স্মারক নং: ${settings?.sarok_no}${enToBnNumber(
      cert?.letter_count
    )}</p>
              <p>তারিখ: ${bnIssueDate}</p>
            </div>

           <div style="border: 1px solid green;margin:auto; background-color: #e6f4ea; padding: 3px; margin-top: 1px; border-radius: 7px;
             width: 250px; text-align: center;">
  <h1 style="font-size: 19px; color: #000080; margin: auto;">
    ${cert.type || "সার্টিফিকেট"}  
  </h1>
</div>
       

<div style="font-size:13px; margin-top:-10px;display:flex;justify-content: left;      align-items: center;    gap: 1.2rem;        flex-wrap: wrap;  ">
<h4>ট্রেড লাইসেন্স নম্বর: ${cert.autoGenNum}</h4>
<h4>অর্থবছর: ${convertToBanglaNumber(
      fiscal_start_year
    )}-${convertToBanglaNumber(fiscal_end_year)}</h4>
<h4>ব্যবসা শুরু তারিখ: ${bnStartDate}</h4>

 

</div>

<div style="margin-top:-30px;font-size:13px;" >
<h4> স্থানীয় সরকার (ইউনিয়ন পরিষদ) আইন, ২০০৯ (২০০৯ সনের ৬১ নং
আইন) এর ধারা ৫৫ তে প্রদত্ত ক্ষমতাবলে সরকার প্রণীত আদর্শ কর
তফসিল, ২০১৬ এর ৬ ও ১৭ নং অনুচ্ছেদ অনুযায়ী ব্যবসা, বৃত্তি, পেশা
বা শিল্প প্রতিষ্ঠানের উপর আরোপিত কর আদায়ের লক্ষ্যে নির্ধারিত শর্তে
নিম্নবর্ণিত ব্যক্তি/প্রতিষ্ঠানের অনুকূলে এই ট্রেড লাইসেন্সটি ইস্যু করা 
হলো:</h4>
</div>



            

            <table style="margin-top:-5px;font-size:14px;">
             
            <tr>
    <td style="width: 20%;font-weight:bold;">ব্যবসা প্রতিষ্ঠানের নাম</td>
    <td style="width:35%;">: ${cert.trade_name}</td>
    <td style="width:45%;"> &nbsp;</td>
  </tr>

   <tr>
    <td style="width: 20%;;font-weight:bold;">মালিক/স্বত্বাধিকারীর নাম</td>
    <td style="width:35%;">: ${cert.applicantName}</td>
    <td style="width:45%;"> &nbsp;</td>
  </tr>

  <tr>
    <td style="width: 20%;font-weight:bold;">মাতার নাম</td>
    <td style="width:35%;">: ${cert.motherName}</td>
    <td style="width:45%;"><b>পিতার নাম:</b> &nbsp;  ${
      cert.fatherName
    }</td>
  </tr>

   

   

   <tr>
    <td style="width: 20%;;font-weight:bold;">স্বত্বাধিকারীর ঠিকানা </td>
    <td style="width:23%; ">: ${cert.address}   </td>
    <td style="width:45%; "> <b>ব্যবসার প্রকৃতি:</b>&nbsp;  ${
      cert.nature
    }&nbsp;  </td>
  </tr>

  


  <tr>
    <td style="width: 20%;;font-weight:bold;">ব্যবসার ধরণ: </td>
    <td style="width:23%; ">: ${cert.trade_type}   </td>
    <td style="width:45%; "> <b>স্বামী/স্ত্রীর নাম:</b> &nbsp;  ${
      cert.spouse
    }</td>
  </tr>

    

  <tr>
    <td style="width: 20%;font-weight:bold;">প্রতিষ্ঠানের ঠিকানা</td>
    <td  style="width:35%;    ">: ${cert.trade_address} </td>
    <td style="width:45%; ">  &nbsp;</td>
  </tr>

   <tr>
    <td style="width: 20%;;font-weight:bold;">জন্মনিবন্ধন/এনআইডি</td>
    <td style="width:35%;">: ${enToBnNumber(
      cert.nid
    )} &nbsp; ${enToBnNumber(cert.birth_no)}  </td>

    <td style="width:45%;"><b>পাসপোর্ট/টি আই এন:</b>&nbsp; ${enToBnNumber(
      cert.passport
    )}  &nbsp; ${enToBnNumber(
      cert.tin
    )} </td>
     
  </tr>

  <tr>
    <td style="width:20%;;font-weight:bold;">মোবাইল</td>
    <td style="width:35%;">: ${enToBnNumber(cert.mobile)}</span>
   </td>
   <td style="width:45%;"><b> ই-মেইল: </b>&nbsp;&nbsp;  <span style="font-size:12px;">${
     cert.email
   } </td>
   
  </tr>

    
 

   

 

 

   

 
 
   

   

    



   
</table>
<div class="container2">
  <table class="tax-table" style="margin-top:-9px;font-size:14px;">
    <tbody>
      <tr class="header-row">
        <td colspan="4" style='text-align:center;color:indigo;' class="header-cell">
          ট্যাক্স বিবরণী
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">ট্রেড লাইসেন্স ফি</td>
        <td class="input-cell">
          <input type="text"  value=${enToBnNumber(cert.trade_fee) || "০"} />
        </td>
        <td class="label-cell">মুলধন কর</td>
        <td class="input-cell">
          <input type="text" value=${
            enToBnNumber(cert.trade_capital_tax) || "০"
          } />
        </td>
      </tr>

       

      <tr class="row">
        <td class="label-cell">বকেয়া</td>
        <td class="input-cell">
          <input type="text"  value=${enToBnNumber(cert.trade_due) || "০"} />
        </td>
         <td class="label-cell">ভ্যাট (%)</td>
        <td class="input-cell">
          <input type="text"   value=${enToBnNumber(cert.trade_vat) || "০"}  />
        </td>
      </tr>

     

      <tr class="row">
        <td class="label-cell">সর্বমোট কর</td>
        <td class="input-cell">
         <span>${enToBnNumber(cert.trade_total_tax)} ( ${numberToBanglaWords(
      bnToEnNumber(cert.trade_total_tax)
    )} টাকা মাত্র)</span>
        </td>
        <td colspan=2>&nbsp;</td>
      </tr>
    </tbody>
  </table>
</div>



<div style="margin-top:1px;font-size:13px;">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; উল্লিখিত ব্যবসা পরিচালনার নিমিত্ত  
${convertToBanglaNumber(fiscal_start)}-${convertToBanglaNumber(
      fiscal_end
    )} সালের জন্য লাইসেন্স প্রদান করা হলো, লাইসেন্সটি ${convertToBanglaNumber(
      endYear
    )} সালের ৩০শে জুন পর্যন্ত কার্যকর থাকবে।

</div>
 

<br>
          

              ${signatureHTML}

          </div>
        </div>
      </div>

      <br>
      <br>
      <br>

      <div class="outer-border">
        <div class="middle-border">
          <div class="inner-border">
             

            ${headerHTML}

            

            <div class="top-section">
              <p>স্মারক নং: ${settings?.sarok_no}${enToBnNumber(
      cert?.letter_count
    )}</p>
              <p>তারিখ: ${bnIssueDate}</p>
            </div>

             

<div style="border: 1px solid green;margin:auto; background-color: #e6f4ea; padding: 5px; margin-top: 15px; border-radius: 7px;
             width: 290px; text-align: center;">
  <h1 style="font-size: 19px; color: #000080; margin: auto;">
    ${cert.type || "সার্টিফিকেট"} (অফিস কপি)
  </h1>
</div>

<div style="font-size:13px; margin-top:-10px;display:flex;justify-content: left;      align-items: center;    gap: 1.2rem;        flex-wrap: wrap;  ">
<h4>ট্রেড লাইসেন্স নম্বর: ${cert.autoGenNum}</h4>
<h4>অর্থবছর: ${convertToBanglaNumber(
      fiscal_start_year
    )}-${convertToBanglaNumber(fiscal_end_year)}</h4>
<h4>ব্যবসা শুরু তারিখ: ${bnStartDate}</h4>

 

</div>



            

            <table style="font-size:14px;">
            <tr>
    <td style="width: 30%;">প্রতিষ্ঠানের নাম</td>
    <td style="margin-left:20px;">: ${cert.trade_name}</td>
  </tr>


   <tr>
    <td style="width: 30%;">পেশা ও ব্যবসার ধরণ</td>
    <td style="margin-left:20px;">: ${cert.trade_type}</td>
  </tr>


  <tr>
    <td style="width: 30%;">প্রতিষ্ঠানের ঠিকানা</td>
    <td style="margin-left:20px;">: ${cert.trade_address}</td>
  </tr>


  <tr>
    <td style="width: 30%;">লাইসেন্সধারীর নাম</td>
    <td style="margin-left:20px;">: ${cert.applicantName}</td>
  </tr>
  <tr>
    <td>পিতার নাম</td>
    <td>: ${cert.fatherName || "-"}</td>
  </tr>
  <tr>
    <td>মাতার নাম</td>
    <td>: ${cert.motherName || "-"}</td>
  </tr>

   <tr>
    <td>জাতীয় পরিচয়পত্র নম্বর:</td>
    <td>: ${enToBnNumber(cert.nid) || "-"}</td>
  </tr>

    


   
</table>
<div class="container2">
  <table class="tax-table" style="font-size:14px;">
    <tbody>
      <tr class="header-row">
        <td colspan="2" class="header-cell">
          ট্যাক্স বিবরণী
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">ট্রেড লাইসেন্স ফি</td>
        <td class="input-cell">
          <input type="text"  value=${enToBnNumber(cert.trade_fee) || "০"} />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">মুলধন কর</td>
        <td class="input-cell">
          <input type="text" value=${
            enToBnNumber(cert.trade_capital_tax) || "০"
          } />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">বকেয়া</td>
        <td class="input-cell">
          <input type="text"  value=${enToBnNumber(cert.trade_due) || "০"} />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">ভ্যাট (%)</td>
        <td class="input-cell">
          <input type="text"   value=${enToBnNumber(cert.trade_vat) || "০"}  />
        </td>
      </tr>

      <tr class="row">
        <td class="label-cell">সর্বমোট কর</td>
        <td class="input-cell">
         <span>${enToBnNumber(cert.trade_total_tax)} ( ${numberToBanglaWords(
      bnToEnNumber(cert.trade_total_tax)
    )} টাকা মাত্র)</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>



 
 


          

            <div class="signature-area">
            

              

              <div class="signature-box" >
                <p style="margin-left:400px; margin-top:50px; width: 200px; padding-top: 5px;">   আদায়কারীর স্বাক্ষর </p>
               
                
              </div>
            
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

    openPrintWindow(printContents);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        ইউনিয়ন পরিষদ সকল সনদ{" "}
         
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black border p-6 rounded-xl shadow mb-8 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-indigo-700">সনদের ধরন</label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border p-2 rounded w-full"
              disabled={isEditingType}
            >
              <option value="">-- সনদের ধরন নির্বাচন করুন --</option>
              <option value="নাগরিকত্ব সনদ">নাগরিকত্ব সনদ</option>
              <option value="জাতীয়তা সনদ">জাতীয়তা সনদ</option>

              <option value="ট্রেড লাইসেন্স">ট্রেড লাইসেন্স</option>
              <option value="নাম সংক্রান্ত প্রত্যয়ন পত্র">
                নাম সংক্রান্ত প্রত্যয়ন পত্র
              </option>
              <option value="বিবিধ সনদ">বিবিধ সনদ</option>
              <option value="চারিত্রিক সনদ">চারিত্রিক সনদ</option>
              <option value="অবিবাহিত সনদ">অবিবাহিত সনদ</option>
              <option value="ভূমিহীন সনদ">ভূমিহীন সনদ</option>
              <option value="বেকারত্ব সনদ">বেকারত্ব সনদ</option>
              <option value="স্বামী পরিত্যক্তা সনদ">
                স্বামী পরিত্যক্তা সনদ
              </option>
              <option value="বিধবা সনদ">বিধবা সনদ</option>
              <option value="সম্প্রদায় সনদ">সম্প্রদায় সনদ</option>
              <option value="বার্ষিক আয়ের সনদ">বার্ষিক আয়ের সনদ</option>
              <option value="ভোটার স্থানান্তর সংক্রান্ত সনদ">
                ভোটার স্থানান্তর সংক্রান্ত সনদ
              </option>
              <option value="অভিভাবক সম্মতিপত্র">অভিভাবক সম্মতিপত্র</option>
              <option value="দ্বিতীয়/পুনঃ বিবাহ না হওয়ার সনদপত্র">
                দ্বিতীয়/পুনঃ বিবাহ না হওয়ার সনদপত্র
              </option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              আবেদনকারীর নাম <span className="text-red-600 text-xl ">*</span>
            </label>
            <input
              type="text"
              required
              value={form.applicantName}
              onChange={(e) =>
                setForm({ ...form, applicantName: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="আবেদনকারীর নাম"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              পিতার নাম<span className="text-red-600 text-xl ">*</span>
            </label>
            <input
              type="text"
              value={form.fatherName}
              onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="পিতার নাম"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              মাতার নাম<span className="text-red-600 text-xl ">*</span>
            </label>
            <input
              type="text"
              value={form.motherName}
              onChange={(e) => setForm({ ...form, motherName: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="মাতার নাম"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              স্বামী/স্ত্রীর নাম
            </label>
            <input
              type="text"
              value={form.spouse}
              onChange={(e) => setForm({ ...form, spouse: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="স্বামী/স্ত্রীর নাম"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              জন্ম তারিখ<span className="text-red-600 text-xl ">*</span>
            </label>
            <br></br>

            <DatePicker
              id="birthDate"
              selected={form.birthDate ? new Date(form.birthDate) : null}
              onChange={(date) =>
                setForm({
                  ...form,
                  birthDate: date
                    ? new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .split("T")[0]
                    : "",
                })
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="জন্ম তারিখ নির্বাচন করুন"
              className="border p-2 rounded w-full min-w-64"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              জাতীয় পরিচয়পত্র নম্বর
            </label>
            <input
              type="text"
              value={form.nid ?? ""}
              onChange={(e) => {
                let value = e.target.value;

                // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                value = value.replace(/[০-৯]/g, (digit) =>
                  String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                );

                // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                if (/^[0-9]*$/.test(value) && value.length <= 17) {
                  setForm({ ...form, nid: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="NID (শুধু ইংরেজি সংখ্যা লিখুন)"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              জন্ম নিবন্ধন নম্বর
            </label>

            <input
              type="text"
              value={form.birth_no ?? ""}
              onChange={(e) => {
                let value = e.target.value;

                // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                value = value.replace(/[০-৯]/g, (digit) =>
                  String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                );

                // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                if (/^[0-9]*$/.test(value)) {
                  setForm({ ...form, birth_no: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="ইংরেজি সংখ্যায় লিখুন"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">ওয়ার্ড</label>
            <input
              type="text"
              value={form.ward ?? ""}
              onChange={(e) => {
                let value = e.target.value;

                // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                value = value.replace(/[০-৯]/g, (digit) =>
                  String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                );

                // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                if (/^[0-9]*$/.test(value)) {
                  setForm({ ...form, ward: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="ইংরেজি সংখ্যায় লিখুন"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">হোল্ডিং</label>
            <input
              type="text"
              value={form.holding_no ?? ""}
              onChange={(e) => {
                let value = e.target.value;

                // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                value = value.replace(/[০-৯]/g, (digit) =>
                  String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                );

                // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                if (/^[0-9]*$/.test(value)) {
                  setForm({ ...form, holding_no: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="ইংরেজি সংখ্যায় লিখুন"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">মৌজা</label>
            <input
              type="text"
              value={form.mouza}
              onChange={(e) => setForm({ ...form, mouza: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="মৌজা"
            />
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              পোস্ট অফিস<span className="text-red-600 text-xl ">*</span>
            </label>
            <input
              type="text"
              value={form.post_office}
              onChange={(e) =>
                setForm({ ...form, post_office: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="পোস্ট অফিস"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold text-indigo-700">
              ঠিকানা(গ্রাম)<span className="text-red-600 text-xl ">*</span>
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="ঠিকানা"
              rows={2}
            />
          </div>

          {form.type === "ট্রেড লাইসেন্স" && (
            <>
              <div>
                <label className="font-semibold text-indigo-700">
                  প্রতিষ্ঠানের নাম
                  <span className="text-red-600 text-xl ">*</span>
                </label>
                <input
                  type="text"
                  value={form.trade_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, trade_name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="ট্রেডের নাম"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  প্রতিষ্ঠানের ঠিকানা
                  <span className="text-red-600 text-xl ">*</span>
                </label>
                <input
                  type="text"
                  value={form.trade_address || ""}
                  onChange={(e) =>
                    setForm({ ...form, trade_address: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="ট্রেডের ঠিকানা"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  ব্যবসায়ের প্রকৃতি
                  <span className="text-red-600 text-xl ">*</span>
                </label>

                <select
                  value={form.nature}
                  onChange={(e) => setForm({ ...form, nature: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="একক">একক</option>
                  <option value="যৌথ">যৌথ</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  ট্রেডের ধরন<span className="text-red-600 text-xl ">*</span>
                </label>
                <input
                  type="text"
                  value={form.trade_type}
                  onChange={(e) =>
                    setForm({ ...form, trade_type: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  placeholder="ট্রেডের ধরন"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  পাসপোর্ট
                </label>
                <input
                  type="text"
                  value={form.passport}
                  onChange={(e) =>
                    setForm({ ...form, passport: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">মোবাইল</label>
                <input
                  type="text"
                  value={form.mobile}
                  className="border p-2 rounded w-full"
                  onChange={(e) => {
                    let value = e.target.value;

                    // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                    value = value.replace(/[০-৯]/g, (digit) =>
                      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                    );

                    // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                    if (/^[0-9]*$/.test(value) && value.length <= 11) {
                      setForm({ ...form, mobile: value });
                    }
                  }}
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">ই-মেইল</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  ব্যবসা শুরুর তারিখ
                  <span className="text-red-600 text-xl ">*</span>
                </label>
                <br></br>

                <DatePicker
                  id="businessStartDate"
                  selected={
                    form.businessStartDate
                      ? new Date(form.businessStartDate)
                      : null
                  }
                  onChange={(date) =>
                    setForm({
                      ...form,
                      businessStartDate:
                        date?.toISOString().split("T")[0] || "",
                    })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="border p-2 rounded w-full min-w-64"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  টি আই এন
                </label>
                <input
                  type="text"
                  value={form.tin}
                  onChange={(e) => setForm({ ...form, tin: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  {" "}
                  ট্রেড লাইসেন্স ফি
                  <span className="text-red-600 text-xl ">*</span>
                </label>

                <input
                  type="text"
                  value={form.trade_fee ?? ""}
                  onChange={(e) => {
                    let value = e.target.value;

                    // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                    value = value.replace(/[০-৯]/g, (digit) =>
                      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                    );

                    // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                    if (/^[0-9]*$/.test(value)) {
                      setForm({ ...form, trade_fee: value });
                    }
                  }}
                  className="border p-2 rounded w-full"
                  placeholder="ট্রেড লাইসেন্স ফি"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  মুলধন কর
                </label>

                <input
                  type="text"
                  value={form.trade_capital_tax ?? ""}
                  onChange={(e) => {
                    let value = e.target.value;

                    // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                    value = value.replace(/[০-৯]/g, (digit) =>
                      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                    );

                    // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                    if (/^[0-9]*$/.test(value)) {
                      setForm({ ...form, trade_capital_tax: value });
                    }
                  }}
                  className="border p-2 rounded w-full"
                  placeholder="মুলধন কর"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">বকেয়া</label>

                <input
                  type="text"
                  value={form.trade_due ?? ""}
                  onChange={(e) => {
                    let value = e.target.value;

                    // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                    value = value.replace(/[০-৯]/g, (digit) =>
                      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                    );

                    // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                    if (/^[0-9]*$/.test(value)) {
                      setForm({ ...form, trade_due: value });
                    }
                  }}
                  className="border p-2 rounded w-full"
                  placeholder="বকেয়া"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">ভ্যাট</label>

                <input
                  type="text"
                  value={form.trade_vat ?? ""}
                  onChange={(e) => {
                    let value = e.target.value;

                    // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                    value = value.replace(/[০-৯]/g, (digit) =>
                      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                    );

                    // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                    if (/^[0-9]*$/.test(value)) {
                      setForm({ ...form, trade_vat: value });
                    }
                  }}
                  className="border p-2 rounded w-full"
                  placeholder="ভ্যাট"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  সর্বমোট কর
                </label>

                <input
                  type="text"
                  value={form.trade_total_tax ?? ""}
                  onChange={(e) => {
                    let value = e.target.value;

                    // ✅ বাংলা সংখ্যা (০-৯) কে ইংরেজি (0-9) তে রূপান্তর
                    value = value.replace(/[০-৯]/g, (digit) =>
                      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                    );

                    // ✅ শুধু ইংরেজি সংখ্যা এবং সর্বোচ্চ 17 সংখ্যা অনুমোদিত
                    if (/^[0-9]*$/.test(value)) {
                      setForm({ ...form, trade_total_tax: value });
                    }
                  }}
                  className="border p-2 rounded w-full"
                  placeholder="মোট কর"
                />
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  অর্থবছর (শুরু)
                </label>
                <select
                  value={form.fiscalYear}
                  onChange={(e) =>
                    setForm({ ...form, fiscalYear: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="Y2024_2025">২০২৪-২৫</option>
                  <option value="Y2025_2026">২০২৫-২৬</option>
                  <option value="Y2026_2027">২০২৬-২৭</option>
                  <option value="Y2027_2028">২০২৭-২৮</option>
                  <option value="Y2028_2029">২০২৮-২৯</option>
                  <option value="Y2029_2030">২০২৯-৩০</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-indigo-700">
                  অর্থবছর (শেষ)
                </label>
                <select
                  value={form.fiscalYearEnd}
                  onChange={(e) =>
                    setForm({ ...form, fiscalYearEnd: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="Y2024_2025">২০২৪-২৫</option>
                  <option value="Y2025_2026">২০২৫-২৬</option>
                  <option value="Y2026_2027">২০২৬-২৭</option>
                  <option value="Y2027_2028">২০২৭-২৮</option>
                  <option value="Y2028_2029">২০২৮-২৯</option>
                  <option value="Y2029_2030">২০২৯-৩০</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className=" relative font-semibold  text-red-500">
              সনদের নাম্বার (শুধু প্রথমটির জন্য অবশ্যই ইংরেজি নাম্বার) (যদি
              প্রথমটির জন্য ইনপুট দিতে ভুলে যান তবে ডেটা আপডেট না করে আবার ফরম
              পূরণ করে সেভ দিন, আপডেটে এই ফিল্ড কাজ করবে না) <br></br>
              <span className="text-[indigo]">
                {" "}
                প্রথমবার ইনপুট দিতে পাশের বাটনে ক্লিক করুন ও ইংরেজিতে সিরিয়াল
                লিখুন
              </span>
            </label>
            <input
              disabled={isDisabled}
              type="text"
              value={form.letter_count ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                // ✅ শুধুমাত্র ইংরেজি সংখ্যা (0-9) অনুমোদিত
                if (/^\d*$/.test(value)) {
                  setForm({ ...form, letter_count: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder="example: 357"
            />

            {/* Edit Icon */}
            <button
              type="button"
              onClick={() => setIsDisabled(false)}
              className="absolute ml-4 bg-[crimson] p-2 shadow-2xl rounded-2xl   text-[whitesmoke] hover:bg-[green] hover:text-[white]"
            >
              <Pencil size={19} />
              click here for serial entry
            </button>
          </div>

          <div>
            <label className="font-semibold text-indigo-700">
              জারি করার তারিখ
            </label>
            <input
              type="date"
              value={form.issuedDate}
              onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <br></br>
        <br></br>

        <div className="mt-4">
          <label className="font-semibold text-indigo-700">নোটস</label>
          <button
            type="button"
            onClick={() => handleLoadDefaultNote(1)}
            className="bg-green-500 text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(2)}
            className="bg-[seagreen] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default (নাম সংক্রান্ত প্রত্যয়ন)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(3)}
            className="bg-[darkcyan] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(চারিত্রিক)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(4)}
            className="bg-[indigo] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(স্বামী পরিত্যক্তা/বিধবা)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(5)}
            className="bg-[cadetblue] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(ভোটার স্থানান্তর)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(6)}
            className="bg-[crimson] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(অবিবাহিত)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(7)}
            className="bg-[crimson] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(দ্বিতীয়/পুনঃ বিবাহ না হওয়ার)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(8)}
            className="bg-[darkcyan] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(বার্ষিক আয়)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(9)}
            className="bg-[blue] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(অভিভাবক সম্মতিপত্র)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(10)}
            className="bg-[blue] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(ভূমিহীন সনদ)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(11)}
            className="bg-[blue] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(বেকারত্ব সনদ)
          </button>

          <button
            type="button"
            onClick={() => handleLoadDefaultNote(12)}
            className="bg-[blue] text-white mx-4 my-2 px-3 py-1 text-sm rounded-2xl shadow hover:bg-green-600"
          >
            Load Default(সম্প্রদায় সনদ)
          </button>

          {/* <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={form.notes}
            init={{
              height: 200,
              menubar: false,
              directionality: "ltr",
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={(content) => setForm({ ...form, notes: content })}
          /> */}

          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={5}
            placeholder=" "
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition duration-150 ease-in-out"
          />
        </div>

        <button
          type="submit"
          disabled={loading} // ✅ লোডিং চললে ডিসেবল হবে
          className={`w-full bg-blue-600 text-white py-2 rounded mt-4 
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
        >
          {loading ? "⏳ loading..." : form.id ? "আপডেট করুন" : "সেভ করুন"}
        </button>

        {form.id && (
          <button
            type="button"
            onClick={() => resetForm()}
            className="w-full mt-2 bg-gray-400 text-white py-2 rounded"
          >
            নতুন ফরম
          </button>
        )}
      </form>

      <div className="relative bg-white border p-4 rounded-xl shadow">
        {/* ✅ Loading Overlay */}
        {loading ? (
          <div className="absolute inset-0 bg-white bg-opacity-70 z-50 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-red-600 text-sm mt-2">লোড হচ্ছে...</p>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="🔍NID or Birth  নাম্বার দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 mb-4 px-4 py-2 border-2 border-[darkcyan] rounded-2xl bg-green-50 placeholder-green-700 text-green-900 focus:outline-none focus:ring-4 focus:ring-green-300 hover:bg-green-100 transition-all duration-200"
            />
            <h2 className="text-2xl font-semibold mb-3 text-[darkcyan]">
              সকল সনদ
            </h2>
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border p-3">সনদের ধরন</th>
                  <th className="border p-3">সিরিয়াল</th>
                  <th className="border p-3">নাম</th>
                  <th className="border p-3">পিতার নাম</th>

                  <th className="border p-3">এনআইডি</th>
                  <th className="border p-3">জন্ম নিবন্ধন</th>
                  <th className="border p-3">ঠিকানা</th>

                  <th className="border p-3">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center p-4">
                      কোনো সনদ পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
                {currentItems.map((cert, index) => {
                  let rowClass = index % 2 === 0 ? "bg-[indigo] text-white" : "bg-[blueviolet] text-white";
                  if (cert.type === "নাগরিকত্ব সনদ") {
                    rowClass = "bg-[darkcyan] text-white";
                  }

                  return (
                    <tr key={cert.id} className={rowClass}>
                      <td className="border p-3">{cert.type}</td>
                      <td className="border p-3">{cert.letter_count}</td>
                      <td className="border p-3">{cert.applicantName}</td>
                      <td className="border p-3">{cert.fatherName || ""}</td>
                      <td className="border p-3">{cert.nid}</td>
                      <td className="border p-3">{cert.birth_no}</td>
                      <td className="border p-3">{cert.address || ""}</td>
                      <td className="border p-4 space-y-1 space-x-3 text-3xl">
                        <button
                          onClick={() => handleEdit(cert)}
                          className="text-blue-600"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className=" "
                        >
                          🗑
                        </button>

                        <button
                          onClick={() => handleCopy(cert.id,cert.type)}
                          className=" "
                        >
                          📋
                        </button>
                        {cert.type !== "ট্রেড লাইসেন্স" && (
                          <button
                            onClick={() => handlePrint(cert)}
                            className="text-green-600"
                          >
                            🖨️
                          </button>
                        )}
                        {cert.type === "নাম সংক্রান্ত প্রত্যয়ন পত্র" && (
                          <button
                            onClick={() =>
                              handlePrintNameRelated(cert, settings)
                            }
                            className="text-green-600"
                          >
                            নাম সংক্রান্ত
                          </button>
                        )}
                        {cert.type === "ট্রেড লাইসেন্স" && (
                          <button
                            onClick={() => handlePrint_trade(cert)}
                            className="   "
                          >
                            Trade(P)📜
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
