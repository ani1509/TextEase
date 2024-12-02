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




// import React from "react";

// const Footer = (props) => {
//   return (
//     <footer
//       style={{
//         position: "absolute",
//         bottom: "0",
//         width: "100%",
//         backgroundColor: props.mode === "dark" ? "#333" : "#f1f1f1",
//         color: props.mode === "dark" ? "white" : "#042743",
//         textAlign: "center",
//         padding: "10px 0",
//       }}
//     >
//       <p>&copy; TextEase {new Date().getFullYear()}. All Rights Reserved</p>
//     </footer>
//   );
// };

// export default Footer;
