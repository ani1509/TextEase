import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Keys from "./Keys";

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
];

const ShortcutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-50 start-50 translate-middle w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-10"
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
};

export default function Navbar(prop) {
  const [isShortcutOpen, setIsShortcutOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        setIsShortcutOpen((prev) => !prev); // Toggle modal
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-${prop.mode}`}
        style={{
          backgroundColor: prop.mode === "dark" ? "#0f1118" : "#ebdfdf",
          color: prop.mode === "dark" ? "white" : "#042743",
        }}
      >
        <div className="container-fluid">
          <h3 className="my-1">{prop.title}</h3>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

            {/* Dark Mode Toggle */}
            <div
              className={`form-check form-switch text-${
                prop.mode === "light" ? "dark" : "light"
              }`}
            >
              <input
                className="form-check-input cursor-pointer"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                style={{ cursor: "pointer" }}
                onChange={prop.toggleMode}
                checked={prop.mode === "dark"}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
                style={{ cursor: "pointer" }}
              >
                {prop.mode === "light"
                  ? "Enable Dark Mode"
                  : "Disable Dark Mode"}
              </label>
            </div>

            {
              /* Keyboard Shortcuts Button */

              useEffect(() => {
                const handleAltM = (event) => {
                  const isAltKey =
                    event.altKey || event.getModifierState("AltGraph");

                  if (isAltKey && event.key === "m") {
                    event.preventDefault();
                    prop.toggleMode();
                  }
                };

                window.addEventListener("keydown", handleAltM);
                return () => window.removeEventListener("keydown", handleAltM);
                // eslint-disable-next-line
              }, [prop.toggleMode])
            }
            <button
              className={`btn text-${
                prop.mode === "light" ? "dark" : "light"
              } d-none d-lg-block`}
              onChange={prop.toggleMode}
              style={{ height: "38px" }}
              onClick={() => setIsShortcutOpen(true)}
            >
              Keyboard Shortcuts
            </button>
          </div>
        </div>
      </nav>

      {/* Shortcut Modal */}
      <ShortcutModal
        isOpen={isShortcutOpen}
        onClose={() => setIsShortcutOpen(false)}
      />
    </>
  );
}


// Navbar.propTypes = {
//   title: propTypes.string.isRequired, // then it becomes mandatory to pass or set a default title
//   abt: propTypes.string,
// };

// Navbar.defaultProps = {
//   title: "Set your title here",
//   abt: "About",
// };

// use shorcut = " IMPT"
// use shorcut = " RFC"

// import propTypes from "prop-types"; // ****** to fix the type of VARIBLE we would sent ****

// import { Link } from "react-router-dom";   // bcz of this, PAGE doesnt has to reload... as in case of "<a href="https://"

// Navbar.propTypes = {
//   title: propTypes.string.isRequired, // then it becomes mandatory to pass or set a default title
//   abt: propTypes.string,
// };

// Navbar.defaultProps = {
//   title: "Set your title here",
//   abt: "About",
// };
