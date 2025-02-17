import React from "react";

const Keys = ({ shortcuts }) => {
  return (
    <div className="row">
      <ul className="list-unstyled d-flex flex-wrap w-100">
        {shortcuts.map((shortcut, index) => (
          <li key={index} className="col-md-6 d-flex mb-2">
            <span
              className="fw-bold me-3 flex-shrink-0"
              style={{ minWidth: "120px" }}
            >
              {shortcut.key}
            </span>
            <span className="flex-grow-1">{shortcut.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Keys;
