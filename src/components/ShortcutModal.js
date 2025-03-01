// import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Keys from "./Keys";

// Keyboard Shortcuts Data
const shortcutsData = [
  { key: "Alt + C", desc: "Copy" },
  { key: "Alt + S", desc: "Start Reading" },
  { key: "Alt + K", desc: "Clear" },
  { key: "Alt + W", desc: "Amount in Words" },
  { key: "Alt + Y", desc: "Redo" },
  { key: "Alt + P", desc: "Focus on Textarea" },
  { key: "Alt + Z", desc: "Undo" },
  { key: "Alt + M", desc: "Dark/Light Mode" },
  { key: "Alt + V", desc: "Paste" },
  { key: "Ctrl + /", desc: "Keyboard Shortcuts" },
  { key: "Alt + Q", desc: "Generate QR" },
];

export default function ShortcutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-50 start-50 translate-middle w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-25"
      style={{ zIndex: 1050, backdropFilter: "blur(0.5px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-light text-dark p-4 rounded shadow-lg w-50"
      >
        {/* Header with Title and Close Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-5 fw-semibold m-0">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="btn btn-light rounded-circle p-1 d-flex align-items-center justify-content-center"
          >
            <X size={20} />
          </button>
        </div>
        <Keys shortcuts={shortcutsData} />
      </motion.div>
    </div>
  );
}
