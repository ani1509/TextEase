// use shorcut = " IMPT"
// use shorcut = " RFC"

import propTypes from "prop-types"; // ****** to fix the type of VARIBLE we would sent ****

// import { Link } from "react-router-dom";   // bcz of this, PAGE doesnt has to reload... as in case of "<a href="https://"

export default function Navbar(prop) {

  return (
    <nav // ****** BELOW {} IS IMPORTANT BCZ V R WRITING JS ********************************
      className={`navbar navbar-expand-lg navbar-${prop.mode} `}
      style={{
        backgroundColor: prop.mode === "dark" ? "#0f1118" : "#ebdfdf",
        color: prop.mode === "dark" ? "white" : "#042743",
      }}
    >
      <div className="container-fluid ">
        {/* <a className="navbar-brand" href="#"></a> */}
        <h3>{prop.title}</h3>
        {/* <Link className="navbar-brand " to="/">
          {prop.title}
        </Link> */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          light-
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li> */}
            {/* <li className="nav-item">
              <Link className="nav-link" to="/about">
                {prop.abt}
              </Link>
            </li> */}
          </ul>

          {/* ******* BELOW  WE HAVE USED TERNARY OPERATOR ******* */}
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
              style={{ cursor: "pointer" }} ////   **** VVIMP ********************************
              onClick={prop.toggleMode} // ******* toggleMode USED HERE *******
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
              style={{ cursor: "pointer" }} ////   **** VVIMP ********************************
            >
              {prop.mode === "light" ? "Enable Dark Mode" : "Disable Dark Mode"}
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  title: propTypes.string.isRequired, // then it becomes mandatory to pass or set a default title
  abt: propTypes.string,  
};

Navbar.defaultProps = {
  title: "Set your title here",
  abt: "About",
};
