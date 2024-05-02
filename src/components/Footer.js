import React from "react";

const Footer = (props) => {
  return (
    <footer>
      <div
        className="text-center"
        style={{ color: props.mode === "dark" ? "white" : "#042743" }}
      >
        <p>&copy; TextEase {new Date().getFullYear()}. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
