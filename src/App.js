// https://v5.reactrouter.com/web/guides/quick-start

// FOR ERROR SOLVING USE --->> https://stackoverflow.com/questions/63124161/attempted-import-error-switch-is-not-exported-from-react-router-dom

import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm";

import React, { useState } from "react";
import Alert from "./components/Alert";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";


function App() {
  const [mode, setMode] = useState("light");
  const [alert, setAlert] = useState(null); // taking NULL bcz it's used as an object ****

  const showAlert = (message, type) => {
    setAlert({
      // ******* here we can use same variable or different variables name *******
      msg: message,
      type: type,
    });

    //  ***** below is used to set setAlert to NULL after 1sec *****
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "#212532";
      showAlert("Dark mode enabled", "success");
    } 
    else {
      document.body.style.backgroundColor = "white";
      setMode("light");
      showAlert("Light mode enabled", "success");
    }
  };

  return (
    <>
      {/* <Router> */}
        <Navbar title="TextEase" mode={mode} toggleMode={toggleMode} />
        <Alert alert={alert} />
        <div className="container my-3">
          {/* <Routes> */}
            {/* <Route */}
              {/* exact
              path="/"
              element={ */}
                <TextForm
                  heading="Enter Your Text"
                  mode={mode}
                  showAlert={showAlert}
                />
              {/* }
            /> */}
            {/* <Route exact path="/about" element={<About />} /> */}
          {/* </Routes> */}
          <Footer mode={mode} />
        </div>
      {/* </Router> */}
    </>
  );
}
export default App;
