"use client";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";

export default function CKEditorComponent({ onChange }) {
  const [data, setData] = useState("");

  return (
    <div className="border rounded p-2">
      <CKEditor
        editor={ClassicEditor}
        data="<p>এখানে লিখুন...</p>"
        onChange={(event, editor) => {
          const content = editor.getData();
          setData(content);
          if (onChange) {
            onChange(content); // প্যারেন্টে ডেটা পাঠাবে
          }
        }}
        onReady={(editor) => {
          console.log("✅ Editor is ready to use!", editor);
        }}
      />
    </div>
  );
}
