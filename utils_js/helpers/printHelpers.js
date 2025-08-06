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




// printhelper.js

export function getHeaderSection(settings, govtImg, unionImg) {
  return `
  <div class="watermark"></div>
    <div class="header-section">
      <img src="${govtImg}" class="header-logo" alt="Government Logo" />
      <div>
        <h3 class="header-title">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h3>
        <h1 class="header-title" style="color:#A52A2A; font-size:29px; font-weight:bold;">
          ${settings?.union_name || ""}
        </h1>
        <h1 class="header-title">${settings?.upazila},&nbsp;${settings?.district}</h1>
        <h1 class="header-title"> ${settings?.notes} </h1>
      </div>
      <img src="${unionImg}" class="header-logo" alt="Union Logo" />
    </div>
  `;
}


export function getHeaderSectionTrade(settings, govtImg, unionImg) {
  return `
  <div class="watermark"></div>
    <div class="header-section">
      <img src="${govtImg}" class="header-logo" alt="Government Logo" />
      <div>
        <h3 class="header-title">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h3>
        <h1 class="header-title" style="color:#A52A2A; font-size:29px; font-weight:bold;">
          ${settings?.union_name || ""}
        </h1>
        <h1 class="header-title">${settings?.upazila},&nbsp;${settings?.district}</h1>
        <h1 class="header-title" style="font-size:16px;"> ${settings?.notes} </h1>
      </div>
      <div style="width: 120px;
  height: 140px;
  border: 1px solid green;
  text-align: center;
  line-height: 140px;
  font-size: 14px;
  color: #888;">
ছবি
      </div>
    </div>
  `;
}



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
  qrImgWithLink,
  type
) {
  return `
    <div class="signature-area" style=" page-break-inside: avoid !important;
    break-inside: avoid !important;">
      ${
  ["নাগরিকত্ব সনদ", "জাতীয়তা সনদ", "জাতীয়তা সনদ","ট্রেড লাইসেন্স"].includes(type)
    ? `<div class="signature-box"  >
        <p>${settings?.union_name === "২নং পাতাছড়া ইউনিয়ন পরিষদ" ? ". " : ""}</p>
        <p style="margin: 0; width: 200px; padding-top: 5px;font-size:19px;font-weight:bold;">
          ${signer2?.name || ""}
        </p>
        <p>${designationText2 || ""}</p>
        <p>${settings?.union_name || ""}</p>
        <p>${settings?.upazila || ""}, ${settings?.district || ""}</p>
      </div>`
    : `<div class="signature-box empty"></div>`
}


      <img src="${qrImgWithLink}" class="qr-code" alt="QR Code" />

      <div class="signature-box" style=" margin:0;padding:0; page-break-inside: avoid !important;
    break-inside: avoid !important;" >
      <p>  ${
    settings?.union_name === "২নং পাতাছড়া ইউনিয়ন পরিষদ"
      ? `<img src="/images/patachara_sign.png" alt="" style="width:110px;height:45px; margin-top:-50px;" />`
      : ""
  }</p>
      
        <p style="margin: 0; width: 200px; padding-top: 5px;font-size:19px;font-weight:bold;">
          ${signer?.name || ""}
        </p>
        <p>${designationText || ""}</p>
        <p>${settings?.union_name || ""}</p>

        ${
          signer?.notes
            ? `<p> ও </p> <p style="font-size:12px; margin-top:3px;">${signer.notes}</p>`
            : ""
        }


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
export function generateApplicantInfoRows(cert, formatDobDate,nid,birth_no) {
  return `
    <tr>
      <td>পিতার নাম</td>
      <td>: ${cert.fatherName || "-"}</td>
    </tr>
    <tr>
      <td>মাতার নাম</td>
      <td>: ${cert.motherName || "-"}</td>
    </tr>
    ${cert.spouse ? `
<tr>
  <td>স্বামী/ স্ত্রীর নাম</td>
  <td>: ${cert.spouse}</td>
</tr>
` : ""}
    <tr>
      <td>জন্ম তারিখ</td>
      <td>: ${formatDobDate}</td>
    </tr>
     
     

     ${cert.nid ? `
<tr>
  <td>জাতীয় পরিচয়পত্র নম্বর</td>
  <td>: ${nid}</td>
</tr>
` : ""}

${cert.birth_no ? `
<tr>
  <td>জন্ম নিবন্ধন নম্বর</td>
  <td>: ${birth_no}</td>
</tr>
` : ""}
    
     

     

  `;
}


