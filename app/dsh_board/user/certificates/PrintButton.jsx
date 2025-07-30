// PrintButton.js
import React from "react";
import { useReactToPrint } from "react-to-print";

const PrintButton = ({ contentRef, onBeforeGetContent }) => {
  const handlePrint = useReactToPrint({
    content: () => contentRef?.current || null,
    onBeforeGetContent: onBeforeGetContent,
    removeAfterPrint: true
  });

  return (
    <button 
      onClick={handlePrint}
      className="print-button"
      style={{
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        margin: "20px 0"
      }}
    >
      প্রিন্ট করুন
    </button>
  );
};

export default PrintButton;