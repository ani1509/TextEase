import React, { useState, useEffect } from "react";
import ShortcutModal from "./ShortcutModal";

export default function Navbar({ toggleMode, mode, title }) {
  const [isShortcutOpen, setIsShortcutOpen] = useState(false);

  // Handle Keyboard Shortcut (Ctrl + /) to Open Shortcut Modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        setIsShortcutOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle "Alt + M" for Dark Mode Toggle
  useEffect(() => {
    const handleAltM = (event) => {
      if (
        (event.altKey || event.getModifierState("AltGraph")) &&
        event.key === "m"
      ) {
        event.preventDefault();
        toggleMode();
      }
    };

    window.addEventListener("keydown", handleAltM);
    return () => window.removeEventListener("keydown", handleAltM);
  }, [toggleMode]);

  return (
    <>
      <nav
        className={`navbar navbar-${mode} px-1`}
        style={{
          backgroundColor: mode === "dark" ? "#0f1118" : "#ebdfdf",
          color: mode === "dark" ? "white" : "#042743",
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Title */}
          <h3 className="my-1">{title}</h3>

          {/* Right-Aligned Items */}
          <div className="d-flex align-items-center">
            {/* Keyboard Shortcuts Button (Hidden in Small Screens) */}
            <label
              className={`text-${
                mode === "light" ? "dark" : "light"
              } d-none d-lg-block mb-0 me-3`}
              style={{ cursor: "pointer" }}
              // style={{ cursor: "pointer", fontSize: "rem" }}
              onClick={() => setIsShortcutOpen(true)}
            >
              Keyboard Shortcuts
            </label>

            {/* Dark Mode Toggle Icon */}
            <label
              className="form-check-label mb-0"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
              onClick={toggleMode}
            >
              {mode === "light" ? (
                <i className="bi bi-moon-fill"></i> // Moon icon
              ) : (
                <i className="bi bi-sun-fill"></i> // Sun icon
              )}
            </label>
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
