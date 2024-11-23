// import React, { useState } from "react";
// import CryptoJS from "crypto-js";
// import Button from "./Button"; // Import the Button component

// export default function TextForm(props) {
//   const [text, setText] = useState("");
//   const [history, setHistory] = useState([]); // History stack to store previous states

//   // Handle text change
//   const handleOnChange = (e) => {
//     setText(e.target.value);
//   };

//   // Save current text to history
//   const saveToHistory = (currentText) => {
//     setHistory([...history, currentText]);
//   };

//   // Convert text to uppercase
//   const hanldeUpClick = () => {
//     saveToHistory(text);
//     setText(text.toUpperCase());
//     props.showAlert("Changed to uppercase!", "success");
//   };

//   // Convert text to lowercase
//   const hanldeLowClick = () => {
//     saveToHistory(text);
//     setText(text.toLowerCase());
//     props.showAlert("Changed to lowercase!", "success");
//   };

//   // Capitalize first letter of each word
//   const capital = () => {
//     saveToHistory(text);
//     const capitalizedText = text
//       .split("\n")
//       .map((line) =>
//         line
//           .split(" ")
//           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(" ")
//       )
//       .join("\n");
//     setText(capitalizedText);
//     props.showAlert("Capitalized!", "success");
//   };

//   // // Copy text to clipboard
//   // const copyy = () => {
//   //   navigator.clipboard.writeText(text);
//   //   props.showAlert("Text copied!", "success");
//   // };


//   const copyy = () => {
//     if (!text) {
//       props.showAlert("Nothing to copy!", "warning");
//       return;
//     }

//     // Check if navigator.clipboard exists
//     if (navigator.clipboard && navigator.clipboard.writeText) {
//       navigator.clipboard
//         .writeText(text)
//         .then(() => {
//           props.showAlert("Text copied to clipboard!", "success");
//         })
//         .catch((err) => {
//           console.error("Clipboard API failed:", err);
//           fallbackCopyToClipboard(text);
//         });
//     } else {
//       // Fallback for unsupported browsers
//       fallbackCopyToClipboard(text);
//     }
//   };

//   // Fallback method using execCommand
//   const fallbackCopyToClipboard = (text) => {
//     try {
//       const textArea = document.createElement("textarea");
//       textArea.value = text;
//       textArea.style.position = "fixed"; // Prevent scrolling to bottom
//       textArea.style.opacity = "0"; // Hide the textarea
//       document.body.appendChild(textArea);
//       textArea.focus();
//       textArea.select();

//       const successful = document.execCommand("copy");
//       document.body.removeChild(textArea);

//       if (successful) {
//         props.showAlert("Text copied to clipboard!", "success");
//       } else {
//         props.showAlert("Failed to copy text!", "danger");
//       }
//     } catch (err) {
//       console.error("Fallback copy failed:", err);
//       props.showAlert("Copying is not supported on this device!", "danger");
//     }
//   };





//   // Clear text
//   const clearr = () => {
//     saveToHistory(text);
//     setText("");
//     props.showAlert("Text cleared!", "success");
//   };

//   // Remove extra spaces
//   const rmvExtraSpc = () => {
//     saveToHistory(text);
//     setText(text.split(/[ ]+/).join(" "));
//     props.showAlert("Removed Extra Space!", "success");
//   };

//   // Add numbering to list
//   const handleNumberedList = () => {
//     saveToHistory(text);

//     // Remove existing numbering pattern (e.g., '1. ', '2. ', etc.) from each line
//     const lines = text.split("\n").map((line) => line.replace(/^\d+\.\s*/, ""));

//     // Add numbering to cleaned lines
//     const numberedText = lines
//       .map((line, index) => `${index + 1}. ${line}`)
//       .join("\n");

//     setText(numberedText);
//     props.showAlert("Numbering on list done!", "success");
//   };

//   // Sort text alphabetically
//   const handleSortButtonClick = () => {
//     saveToHistory(text);
//     const lines = text.split("\n");
//     const sortedText = lines
//       .slice()
//       .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())) // Case-insensitive comparison
//       .join("\n")
//       .trim();
//     setText(sortedText);
//     props.showAlert("List sorted alphabetically!", "success");
//   };

//   // Undo the last change
//   const handleUndo = () => {
//     if (history.length > 0) {
//       setText(history[history.length - 1]); // Get the last state from history
//       setHistory(history.slice(0, -1)); // Remove the last state from history
//       props.showAlert("Undone!", "success");
//     } else {
//       props.showAlert("Nothing to undo!", "danger");
//     }
//   };

//   // Count words, characters, and letters
//   const wordCount = text.split(/\s+/).filter((el) => el.length !== 0).length;
//   const charCount = text.length;
//   const letterCount = text
//     .split("")
//     .filter((char) => /[a-zA-Z]/.test(char)).length;

//   // Encrypt the text
//   const handleEncrypt = () => {
//     if (!text) {
//       props.showAlert("Please enter text to encrypt!", "danger");
//       return;
//     }
//     const secretKey = prompt("Enter a secret key for encryption:");
//     if (secretKey) {
//       const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
//       saveToHistory(text);
//       setText(encryptedText);
//       props.showAlert("Text encrypted!", "success");
//     } else {
//       props.showAlert("Encryption key is required!", "danger");
//     }
//   };

//   // Decrypt the text
//   const handleDecrypt = () => {
//     if (!text) {
//       props.showAlert("Please enter text to decrypt!", "danger");
//       return;
//     }
//     const secretKey = prompt("Enter the secret key for decryption:");
//     if (secretKey) {
//       try {
//         const bytes = CryptoJS.AES.decrypt(text, secretKey);
//         const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
//         if (!decryptedText) throw new Error();
//         saveToHistory(text);
//         setText(decryptedText);
//         props.showAlert("Text decrypted!", "success");
//       } catch (error) {
//         props.showAlert("Invalid key or corrupted text!", "danger");
//       }
//     } else {
//       props.showAlert("Decryption key is required!", "danger");
//     }
//   };

//   return (
//     <>
//       <div
//         className="container"
//         style={{
//           color: props.mode === "dark" ? "white" : "#042743",
//         }}
//       >
//         <h4>{props.heading}</h4>
//         <div className="mb-3">
//           <textarea
//             className="form-control"
//             value={text}
//             onChange={handleOnChange}
//             id="myBox"
//             rows="8"
//             style={{
//               backgroundColor: props.mode === "dark" ? "#0f1118" : "#ebdfdf",
//               color: props.mode === "dark" ? "white" : "#042743",
//             }}
//           ></textarea>
//         </div>

//         {/* Use Button Component for actions */}
//         <Button text="To UpperCase" onClick={hanldeUpClick} mode={props.mode} />
//         <Button
//           text="To LowerCase"
//           onClick={hanldeLowClick}
//           mode={props.mode}
//         />
//         <Button text="Capitalize" onClick={capital} mode={props.mode} />
//         <Button
//           text="Sort Alphabetically"
//           onClick={handleSortButtonClick}
//           mode={props.mode}
//         />
//         <Button
//           text="Numbered List"
//           onClick={handleNumberedList}
//           mode={props.mode}
//         />
//         <Button
//           text="Remove Extra Space"
//           onClick={rmvExtraSpc}
//           mode={props.mode}
//         />
//         <Button text="Encrypt Text" onClick={handleEncrypt} mode={props.mode} />
//         <Button text="Decrypt Text" onClick={handleDecrypt} mode={props.mode} />
//         <Button text="Copy" onClick={copyy} mode={props.mode} />
//         <Button text="Undo" onClick={handleUndo} mode={props.mode} />
//         <Button text="Clear" onClick={clearr} mode={props.mode} />
//       </div>

//       <div
//         className="container"
//         style={{
//           color: props.mode === "dark" ? "white" : "#042743",
//           marginTop: 20,
//         }}
//       >
//         <h4>Text Summary</h4>
//         <p>
//           {wordCount} words, {letterCount} letters, and {charCount} characters
//         </p>
//         <p>{0.008 * wordCount} Minutes read</p>
//         <h4>Preview</h4>
//         <p>{text.length > 0 ? text : "Enter something to preview"}</p>
//       </div>
//     </>
//   );
// }




import React, { useState } from "react";
import CryptoJS from "crypto-js";
import Button from "./Button"; // Import the Button component

export default function TextForm(props) {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]); // History stack to store previous states

  // Handle text change
  const handleOnChange = (e) => {
    setText(e.target.value);
  };

  // Save current text to history
  const saveToHistory = (currentText) => {
    setHistory([...history, currentText]);
  };

  // Convert text to uppercase
  const hanldeUpClick = () => {
    if (!text) {
      props.showAlert("Nothing to convert to uppercase!", "warning");
      return;
    }
    saveToHistory(text);
    setText(text.toUpperCase());
    props.showAlert("Changed to uppercase!", "success");
  };

  // Convert text to lowercase
  const hanldeLowClick = () => {
    if (!text) {
      props.showAlert("Nothing to convert to lowercase!", "warning");
      return;
    }
    saveToHistory(text);
    setText(text.toLowerCase());
    props.showAlert("Changed to lowercase!", "success");
  };

  // Capitalize first letter of each word
  const capital = () => {
    if (!text) {
      props.showAlert("Nothing to capitalize!", "warning");
      return;
    }
    saveToHistory(text);
    const capitalizedText = text
      .split("\n")
      .map((line) =>
        line
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join("\n");
    setText(capitalizedText);
    props.showAlert("Capitalized!", "success");
  };






  // Copy text to clipboard
  // const copyy = () => {
  //   if (!text) {
  //     props.showAlert("Nothing to copy!", "warning");
  //     return;
  //   }

  //   if (navigator.clipboard && navigator.clipboard.writeText) {
  //     navigator.clipboard
  //       .writeText(text)
  //       .then(() => {
  //         props.showAlert("Text copied to clipboard!", "success");
  //       })
  //       .catch((err) => {
  //         console.error("Clipboard API failed:", err);
  //         props.showAlert("Copy failed!", "danger");
  //       });
  //   } else {
  //     props.showAlert("Clipboard API not supported!", "danger");
  //   }
  // };






   const copyy = () => {
    if (!text) {
      props.showAlert("Nothing to copy!", "warning");
      return;
    }

    // Check if navigator.clipboard exists
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          props.showAlert("Text copied to clipboard!", "success");
        })
        .catch((err) => {
          console.error("Clipboard API failed:", err);
          fallbackCopyToClipboard(text);
        });
    } else {
      // Fallback for unsupported browsers
      fallbackCopyToClipboard(text);
    }
  };

  // Fallback method using execCommand
  const fallbackCopyToClipboard = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed"; // Prevent scrolling to bottom
      textArea.style.opacity = "0"; // Hide the textarea
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        props.showAlert("Text copied to clipboard!", "success");
      } else {
        props.showAlert("Failed to copy text!", "danger");
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      props.showAlert("Copying is not supported on this device!", "danger");
    }
  };

  




  // Clear text
  const clearr = () => {
    if (!text) {
      props.showAlert("Nothing to clear!", "warning");
      return;
    }
    saveToHistory(text);
    setText("");
    props.showAlert("Text cleared!", "success");
  };

  // Remove extra spaces
  const rmvExtraSpc = () => {
    if (!text) {
      props.showAlert("Nothing to process !", "warning");
      return;
    }
    saveToHistory(text);
    setText(text.split(/[ ]+/).join(" "));
    props.showAlert("Removed extra spaces!", "success");
  };

  // Add numbering to list
  const handleNumberedList = () => {
    if (!text) {
      props.showAlert("Nothing to number!", "warning");
      return;
    }
    saveToHistory(text);

    const lines = text.split("\n").map((line) => line.replace(/^\d+\.\s*/, ""));
    const numberedText = lines
      .map((line, index) => `${index + 1}. ${line}`)
      .join("\n");

    setText(numberedText);
    props.showAlert("Numbering applied!", "success");
  };

  // Sort text alphabetically
  const handleSortButtonClick = () => {
    if (!text) {
      props.showAlert("Nothing to sort!", "warning");
      return;
    }
    saveToHistory(text);
    const lines = text.split("\n");
    const sortedText = lines
      .slice()
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .join("\n")
      .trim();
    setText(sortedText);
    props.showAlert("List sorted alphabetically!", "success");
  };

  // Undo the last change
  const handleUndo = () => {
    if (history.length > 0) {
      setText(history[history.length - 1]);
      setHistory(history.slice(0, -1));
      props.showAlert("Undone!", "success");
    } else {
      props.showAlert("Nothing to undo!", "warning");
    }
  };

  // Encrypt the text
  const handleEncrypt = () => {
    if (!text) {
      props.showAlert("Please enter text to encrypt!", "warning");
      return;
    }
    const secretKey = prompt("Enter a secret key for encryption:");
    if (secretKey) {
      const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
      saveToHistory(text);
      setText(encryptedText);
      props.showAlert("Text encrypted!", "success");
    } else {
      props.showAlert("Encryption key is required!", "danger");
    }
  };

  // Decrypt the text
  const handleDecrypt = () => {
    if (!text) {
      props.showAlert("Please enter text to decrypt!", "warning");
      return;
    }
    const secretKey = prompt("Enter the secret key for decryption:");
    if (secretKey) {
      try {
        const bytes = CryptoJS.AES.decrypt(text, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) throw new Error();
        saveToHistory(text);
        setText(decryptedText);
        props.showAlert("Text decrypted!", "success");
      } catch (error) {
        props.showAlert("Invalid key or corrupted text!", "danger");
      }
    } else {
      props.showAlert("Decryption key is required!", "danger");
    }
  };

  // Count words, characters, and letters
  const wordCount = text.split(/\s+/).filter((el) => el.length !== 0).length;
  const charCount = text.length;
  const letterCount = text
    .split("")
    .filter((char) => /[a-zA-Z]/.test(char)).length;

  return (
    <>
      <div
        className="container"
        style={{
          color: props.mode === "dark" ? "white" : "#042743",
        }}
      >
        <h4>{props.heading}</h4>
        <textarea
          className="form-control"
          value={text}
          onChange={handleOnChange}
          id="myBox"
          rows="8"
          style={{
            backgroundColor: props.mode === "dark" ? "#0f1118" : "#ebdfdf",
            color: props.mode === "dark" ? "white" : "#042743",
          }}
        ></textarea>
        <Button text="To UpperCase" onClick={hanldeUpClick} mode={props.mode} />
        <Button
          text="To LowerCase"
          onClick={hanldeLowClick}
          mode={props.mode}
        />
        <Button text="Capitalize" onClick={capital} mode={props.mode} />
        <Button
          text="Sort Alphabetically"
          onClick={handleSortButtonClick}
          mode={props.mode}
        />
        <Button
          text="Numbered List"
          onClick={handleNumberedList}
          mode={props.mode}
        />
        <Button
          text="Remove Extra Space"
          onClick={rmvExtraSpc}
          mode={props.mode}
        />
        <Button text="Encrypt Text" onClick={handleEncrypt} mode={props.mode} />
        <Button text="Decrypt Text" onClick={handleDecrypt} mode={props.mode} />
        <Button text="Copy" onClick={copyy} mode={props.mode} />
        <Button text="Undo" onClick={handleUndo} mode={props.mode} />
        <Button text="Clear" onClick={clearr} mode={props.mode} />
      </div>

      <div
        className="container"
        style={{
          color: props.mode === "dark" ? "white" : "#042743",
          marginTop: 20,
        }}
      >
        <h4>Text Summary</h4>
        <p>
          {wordCount} words, {letterCount} letters, and {charCount} characters
        </p>
        <p>{0.008 * wordCount} Minutes read</p>
        <h4>Preview</h4>
        <p>{text.length > 0 ? text : "Enter something to preview"}</p>
      </div>
    </>
  );
}
