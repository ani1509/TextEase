import React from "react";

const Button = ({ text, onClick, mode }) => {
  return (
    <button
      className={`btn btn-sm ${mode === "dark" ? "btn-light" : "btn-dark"} mx-1 my-1`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
