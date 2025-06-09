import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Define custom modules with Arabic labels
const modules = {
  toolbar: [
    // Headers
    [{ header: [1, 2, false] }], // Headers (1, 2, Normal Text)
    // Text formatting
    [
      { bold: "عريض" }, // Bold
      { italic: "مائل" }, // Italic
      { underline: "تسطير" }, // Underline
      { strike: "خط متقطع" }, // Strike-through
      { blockquote: "اقتباس" }, // Blockquote
    ],
    // Lists
    [
      { list: "ordered", label: "قائمة مرقمة" }, // Ordered List
      { list: "bullet", label: "قائمة نقطية" }, // Bullet List
      { indent: "-1", label: "تقليص الهوامش" }, // Decrease Indent
      { indent: "+1", label: "زيادة الهوامش" }, // Increase Indent
    ],
    // Alignment
    [
      { align: "" },
      { align: "right", label: "محاذاة لليمين" },
      { align: "center", label: "محاذاة للوسط" },
      { align: "justify", label: "محاذاة للجانبين" },
    ],
    // Direction (Right-to-Left)
    [{ direction: "rtl", label: "من اليمين لليسار" }], // RTL support
    // Links and Images
    ["link", "image"], // Link and image buttons
    ["clean"], // Clear formatting
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "align",
  "direction",
  "link",
  "image",
];

export const RichTextEditor = ({ value, onChange, placeholder }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      theme="snow"
      placeholder={placeholder || "أدخل النص هنا..."} // Arabic placeholder
      style={{
        direction: "rtl", // Right-to-left text direction for Arabic
        fontFamily: "'Amiri', serif", // Use an Arabic-friendly font
        overflow: "unset",
        marginBottom: "80px",
      }}
      formats={formats}
      modules={modules}
    />
  );
};
