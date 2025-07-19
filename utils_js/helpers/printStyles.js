export const commonPrintStyles = `
  @page {
    size: A4;
    margin: 0;
  }

  body {
    font-family: 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    margin: 0;
    padding: 0;
    line-height: 1.3;
    background: #f9f9f9;
  }

  .outer-border {
    margin: 15px;
    padding: 7px;
    background: #000;
  }

  .middle-border {
    padding: 12px;
    background: #fff;
  }

  .inner-border {
    padding: 15px;
    border: 1px solid #000;
    border-radius: 3px;
    background: white;
    position: relative;
    box-sizing: border-box;
    min-height: auto;
    overflow: hidden;
    z-index: 1;
  }

  .watermark {
    background-image: url('__UNION_IMG__'); /* পরে রিপ্লেস হবে */
    background-repeat: no-repeat;
    background-position: center;
    background-size: 60%;
    opacity: 0.08;
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 0 20px;
    position: relative;
    z-index: 1;
    line-height: 0.9;
    font-size: 12px;
  }

  .header-logo {
    width: 80px;
    height: auto;
  }

  .header-title {
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    flex: 1;
  }

  hr {
    border: 1px solid #000;
    margin-top: 7px;
    margin-bottom: 5px;
  }

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
  }

  .top-section p {
    margin: 0;
    margin-top: 5px;
  }

  h2 {
    text-align: center;
    margin: 10px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
  }

  table tr td {
    padding: 5px 0;
  }

  p {
    z-index: 1;
  }

  .signature-area {
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 30px;
    z-index: 1;
  }

  .signature-box {
    text-align: center;
    line-height: 1;
  }

  .qr-code {
    width: 80px;
    height: auto;
  }
`;

// ✅ শুধুমাত্র 2nd style এর জন্য অতিরিক্ত CSS
export const taxTableStyles = `
  .container2 {
    margin-top: 0.1rem;
    display: flex;
    justify-content: center;
  }

  .tax-table {
    width: 100%;
    max-width: 30rem;
    border: 1px solid #86efac;
    border-radius: 0.4rem;
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
    border-collapse: collapse;
  }

  .tax-table tbody tr.header-row {
    border-bottom: 1px solid #bbf7d0;
    background-color: #dcfce7;
  }

  .tax-table tbody tr.header-row td.header-cell {
    padding: 0.1rem;
    font-weight: 700;
    color: #166534;
    text-align: center;
  }

  .tax-table tbody tr.row {
    border-bottom: 1px solid #bbf7d0;
  }

  .tax-table tbody tr.row:last-child {
    border-bottom: none;
  }

  .label-cell {
    padding: 0.1rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .input-cell {
    padding: 0.3rem;
  }

  .input-cell input[type="text"] {
    width: 100%;
    padding: 0.1rem 0.1rem;
    border: 1px solid #4ade80;
    border-radius: 0.375rem;
    background-color: #dcfce7;
    box-sizing: border-box;
    text-align: center;
  }

  .input-cell input[readonly] {
    border-color: #22c55e;
    background-color: #bbf7d0;
    font-weight: 700;
  }
`;
