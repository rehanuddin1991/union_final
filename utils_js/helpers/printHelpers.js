// ✅ ইমেজ প্রিলোড করার ফাংশন
export const preloadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => resolve(url);
  });
};

// ✅ প্রিন্ট উইন্ডো ওপেন করে কনটেন্ট প্রিন্ট করা
export const openPrintWindow = (printContents) => {
  const newWin = window.open("", "_blank", "width=800,height=1000");
  newWin.document.write(printContents);
  newWin.document.close();

  newWin.onload = () => {
    setTimeout(() => {
      newWin.print();
      // newWin.close(); // চাইলে প্রিন্ট শেষে বন্ধ করতে আনকমেন্ট করবেন
    }, 500);
  };
};


// helpers/printHelpers.js

/**
 * Generate Signature HTML block for certificates
 * @param {Object} signer - Primary signer (e.g., Chairman)
 * @param {Object} signer2 - Secondary signer (e.g., Officer-in-Charge)
 * @param {String} designationText - Designation for primary signer
 * @param {String} designationText2 - Designation for secondary signer
 * @param {Object} settings - Union Parishad settings (union_name, upazila, district)
 * @param {String} qrImgWithLink - QR Code image URL
 * @returns {String} - HTML string for signature section
 */
export function generateSignatureHTML(
  signer,
  signer2,
  designationText,
  designationText2,
  settings,
  qrImgWithLink
) {
  return `
    <div class="signature-area">
      <div class="signature-box">
        <p style="margin: 0; width: 200px; padding-top: 5px;">
          ${signer2?.name || ""}
        </p>
        <p>${designationText2 || ""}</p>
        <p>${settings?.union_name || ""}</p>
        <p>${settings?.upazila || ""}, ${settings?.district || ""}</p>
      </div>

      <img src="${qrImgWithLink}" class="qr-code" alt="QR Code" />

      <div class="signature-box">
        <p style="margin: 0; width: 200px; padding-top: 5px;">
          ${signer?.name || ""}
        </p>
        <p>${designationText || ""}</p>
        <p>${settings?.union_name || ""}</p>
        <p>${settings?.upazila || ""}, ${settings?.district || ""}</p>
      </div>
    </div>
  `;
}


/**
 * Generate Certificate Applicant Info Table Rows
 * @param {Object} cert - Certificate data object
 * @param {Function} formatDobDate - Function to format birthDate (must be passed)
 * @returns {String} - HTML table rows as string
 */
export function generateApplicantInfoRows(cert, formatDobDate) {
  return `
    <tr>
      <td>পিতার নাম</td>
      <td>: ${cert.fatherName || "-"}</td>
    </tr>
    <tr>
      <td>মাতার নাম</td>
      <td>: ${cert.motherName || "-"}</td>
    </tr>
    <tr>
      <td>স্বামী/ স্ত্রীর নাম</td>
      <td>: ${cert.spouse || ""}</td>
    </tr>
    <tr>
      <td>জন্ম তারিখ</td>
      <td>: ${formatDobDate}</td>
    </tr>
    <tr>
      <td>গ্রাম</td>
      <td>: ${cert.address || "-"}</td>
    </tr>
    <tr>
      <td>জাতীয় পরিচয়পত্র নম্বর</td>
      <td>: ${cert.nid || ""}</td>
    </tr>
    <tr>
      <td>জন্ম নিবন্ধন নম্বর</td>
      <td>: ${cert.birth_no || ""}</td>
    </tr>
  `;
}


