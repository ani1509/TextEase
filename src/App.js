import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm";
import Alert from "./components/Alert";
import Footer from "./components/Footer";

function App() {
  // Load initial mode from localStorage or default to "light"
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const [alert, setAlert] = useState(null);

  // Show alert message
  const showAlert = (message, type) => {
    setAlert({ msg: message, type });

    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  // Toggle between light and dark modes
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode); // Persist mode to localStorage

    if (newMode === "dark") {
      document.body.style.backgroundColor = "#212532";
      showAlert("Dark mode enabled", "success");
    } else {
      document.body.style.backgroundColor = "white";
      showAlert("Light mode enabled", "success");
    }
  };

  // Sync UI background color with the saved mode on load
  useEffect(() => {
    if (mode === "dark") {
      document.body.style.backgroundColor = "#212532";
    } else {
      document.body.style.backgroundColor = "white";
    }
  }, [mode]);

  return (
    <>
      <Navbar title="WordMaven" mode={mode} toggleMode={toggleMode} />
      <Alert alert={alert} />
      <div className="container my-3">
        <TextForm heading="Enter Your Text" mode={mode} showAlert={showAlert} />
        <Footer mode={mode} />
      </div>
    </>
  );
}

export default App;