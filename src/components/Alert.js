// SHORTCUT "RFCE"
import React from "react";

function Alert(props) {
  const cap = (word) => {
    const lower = word.toLowerCase();

    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <div className="container" style={{ height: "50px" }}>
      {/* /// ***** below -->> props.alert && <<-- is VVIMP bcz when  its NULL it'll NOT SHOW ANYTHING *****  */}

      {props.alert && (
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show`}
          role="alert"
        >
          <strong>{cap(props.alert.type)}</strong>: {props.alert.msg}
        </div>
      )}
    </div>
  );
}

export default Alert;
