import React, { useState } from "react";

export default function TextForm(props) {
  const [text, setText] = useState("");

  const handleOnChange = (e) => {
    const newText = e.target.value;
    setText(newText);
  };

  const capital = () => {
    const cap = text
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
    setText(cap);
    handleOnChange({ target: { value: cap } }); // Add capitalized text to history
    props.showAlert("Capitalized!", "success");
  };

  const hanldeUpClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Changed to uppercase!", "success");
  };

  const hanldeLowClick = () => {
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Changed to lowercase!", "success");
  };

  const copyy = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Text copied!", "success");
  };

  const clearr = () => {
    setText("");
    props.showAlert("Text cleared!", "success");
  };

  const rmvExtraSpc = () => {
    let newText = text.split(/[ ]+/);
    setText(newText.join(" "));
    props.showAlert("Removed Extra Space!", "success");
  };

  const handleNumberedList = () => {
    const lines = text.split("\n");
    let numberedText = "";
    lines.forEach((line, index) => {
      numberedText += `${index + 1}. ${line}\n`;
    });
    setText(numberedText);
    props.showAlert("Numbering on list done!", "success");
  };

  const handleSortButtonClick = () => {
    // Split the text by new lines
    const lines = text.split("\n");
    // Sort the lines alphabetically
    const sortedLines = lines.slice().sort();
    // Join the sorted lines back together
    const sortedText = sortedLines.join("\n").trim(); // Trim to remove extra line
    // Update the text state with sorted text
    setText(sortedText);
    props.showAlert("List sorted alphabetically!", "success");
  };

  return (
    <>
      <div
        className="container"
        style={{
          color: props.mode === "dark" ? "white" : "#042743",
        }}
      >
        <h1>{props.heading}</h1>
        <div className="mb-3 ">
          <textarea
            className="form-control "
            value={text}
            onChange={handleOnChange}
            id="myBox"
            rows="8"
            style={{
              backgroundColor: props.mode === "dark" ? "#0f1118" : "#ebdfdf",
              color: props.mode === "dark" ? "white" : "#042743",
            }}
          ></textarea>
        </div>
        <button
          className={`btn ${
            props.mode === "dark" ? "btn-light" : "btn-dark"
          } mx-1 my-1`}
          onClick={hanldeUpClick}
        >
          To UpperCase
        </button>
        <button
          className={`btn ${
            props.mode === "dark" ? "btn-light" : "btn-dark"
          } mx-1 my-1`}
          onClick={hanldeLowClick}
        >
          To LowerCase
        </button>
        <button
          className={`btn ${
            props.mode === "dark" ? "btn-light" : "btn-dark"
          } mx-1 my-1`}
          onClick={handleNumberedList}
        >
          Numbered List
        </button>
        <button
          className={`btn ${
            props.mode === "dark" ? "btn-light" : "btn-dark"
          } mx-1 my-1`}
          onClick={capital}
        >
          Capitalize
        </button>

        <button
          className={`btn ${
            props.mode === "dark" ? "btn-light" : "btn-dark"
          } mx-1 my-1`}
          onClick={copyy}
        >
          Copy
        </button>
        <button
          className={`btn ${
            props.mode === "dark" ? "btn-light" : "btn-dark"
          } mx-1 my-1`}
          onClick={rmvExtraSpc}
        >
          Remove Extra Space
        </button>

        <button
          className={`btn ${
            props.mode === "dark" ? "btn-light" : "btn-dark"
          } mx-1 my-1`}
          onClick={handleSortButtonClick}
          // disabled={!text.includes("\n")} // Disable if text does not have new lines
        >
          Sort Alphabetically
        </button>
        <button
          className={`btn ${
            props.mode === "dark" ? "btn-light" : "btn-dark"
          } mx-1 my-1`}
          onClick={clearr}
        >
          Clear
        </button>
      </div>

      <div
        className="container"
        style={{
          color: props.mode === "dark" ? "white" : "#042743",
        }}
      >
        <h2>Text summary</h2>
        <p>
          {
            text.split(/\s+/).filter((el) => {
              return el.length !== 0;
            }).length
          }{" "}
          words and {text.length} characters
        </p>
        <p>
          {0.008 *
            text.split(" ").filter((el) => {
              return el.length !== 0;
            }).length}{" "}
          Minutes read
        </p>
        <h2>Preview</h2>
        <p>{text.length > 0 ? text : "Enter something to preview"}</p>
      </div>
    </>
  );
}
