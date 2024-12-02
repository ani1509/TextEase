import React, { useState } from "react";
import CryptoJS from "crypto-js";
import Button from "./Button"; // Import the Button component
import HTMLDocx from "html-docx-js/dist/html-docx";
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation


export default function TextForm(props) {
  const [text, setText] = useState("");
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [history, setHistory] = useState([]); // History stack to store previous states
  const [redoHistory, setRedoHistory] = useState([]); // Redo stack to store undone actions
  const [isReading, setIsReading] = useState(false); // Track if reading is in progress

  // Handle text changes in the main textarea
  const handleTextChange = (event) => {
    // Save current text to history before updating
    setHistory([...history, text]);
    setText(event.target.value);
    setRedoHistory([]); // Clear redo history whenever new text is typed
  };

  // Share options for Gmail, WhatsApp, and X
  const handleShare = (platform) => {
    if (!text) {
      props.showAlert("No text to share!", "warning");
      return;
    }

    let shareUrl = "";

    switch (platform) {
      case "gmail":
        // Open Gmail with a pre-filled email
        shareUrl = `mailto:?subject=Text Shared&body=${encodeURIComponent(
          text
        )}`;
        break;
      case "whatsapp":
        // Open WhatsApp with pre-filled text
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case "x":
        // Open X (Twitter) with a pre-filled tweet
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}`;
        break;
      default:
        return;
    }

    // Open the respective platform's share URL
    window.open(shareUrl, "_blank");
    props.showAlert("Sharing initiated!", "success");
  };

  const handleDownloadAs = (format) => {
    if (!text) {
      props.showAlert("No text to download!", "warning");
      return;
    }

    if (format === "pdf") {
      // Generate PDF
      const doc = new jsPDF();
      doc.text(text, 10, 10);
      doc.save("document.pdf");
      props.showAlert("PDF file is ready for download!", "success");
    } else if (format === "word") {
      // Generate Word file
      const content = `<html><body><p>${text}</p></body></html>`;
      const converted = HTMLDocx.asBlob(content);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(converted);
      link.download = "document.docx";
      link.click();
      props.showAlert("Word file is ready for download!", "success");
    } else if (format === "text") {
      // Generate Text file
      const blob = new Blob([text], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "document.txt";
      link.click();
      props.showAlert("Text file is ready for download!", "success");
    }
  };

  // Handle Undo functionality
  const handleUndo = () => {
    if (history.length > 0) {
      const previousText = history[history.length - 1];
      setRedoHistory([text, ...redoHistory]); // Store current text in redo stack
      setText(previousText);
      setHistory(history.slice(0, -1)); // Remove last entry from history stack
      props.showAlert("Undone!", "success");
    } else {
      props.showAlert("Nothing to undo!", "warning");
    }
  };

  // Handle Redo functionality
  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const redoText = redoHistory[0];
      setHistory([...history, text]); // Store current text in undo history
      setText(redoText);
      setRedoHistory(redoHistory.slice(1)); // Remove the first entry from redo stack
      props.showAlert("Redone!", "success");
    } else {
      props.showAlert("Nothing to redo!", "warning");
    }
  };

  // Handle changes in the Find input box
  const handleFindChange = (e) => {
    setFindValue(e.target.value); // Update find input value
  };

  // Handle changes in the Replace input box
  const handleReplaceChange = (e) => {
    setReplaceValue(e.target.value); // Update replace input value
  };

  // Handle Find and Replace functionality

  const handleFindAndReplace = () => {
    // Check if findValue is empty
    if (!findValue) {
      props.showAlert("Please enter text to find!", "warning");
      return;
    }

    // Escape special characters for regex handling
    const escapedFindValue = findValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Create a global regex for finding only the standalone 'S' (or other specific text) with word boundaries
    const regex = new RegExp(`\\b${escapedFindValue}\\b`, "g");

    // Check if the findValue exists in the text
    if (!regex.test(text)) {
      props.showAlert(`"${findValue}" not found in the text!`, "warning");
      return;
    }

    // Save current state to history before making changes
    saveToHistory(text);

    // Replace all occurrences of the findValue with replaceValue, respecting word boundaries
    const updatedText = text.replace(regex, replaceValue);

    // Update the text with the replaced value
    setText(updatedText);

    // Show success alert
    props.showAlert("Find and Replace completed!", "success");
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

  // Function to remove special characters except letters, numbers, and spaces
  const removeSpecialCharacters = () => {
    // Regular expression to match unwanted special characters
    // Keeps letters, numbers, spaces, and necessary punctuation: , . ! ? ' " : ; ( ) -
    const regex = /[^a-zA-Z0-9\s,.\-!?'""'():;]/g;

    // Remove the unwanted special characters using the regex
    const updatedText = text.replace(regex, "");

    // Save the current state to history for undo
    saveToHistory(text);

    // Update the text state with the sanitized text
    setText(updatedText);
    props.showAlert("Unnecessary special characters removed!", "success");
  };

  // Copy text to clipboard
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
  // const handleAddLineNumbers = () => {
  //   if (!text) {
  //     props.showAlert("Nothing to number!", "warning");
  //     return;
  //   }
  //   saveToHistory(text);

  //   const lines = text.split("\n").map((line) => line.replace(/^\d+\.\s*/, ""));
  //   const numberedText = lines
  //     .map((line, index) => `${index + 1}. ${line}`)
  //     .join("\n");

  //   setText(numberedText);
  //   props.showAlert("Numbering applied!", "success");
  // };

  const handleAddLineNumbers = () => {
    // Remove extra blank lines and split into lines
    const nonBlankLines = text
      .split("\n") // Split text into lines
      .filter((line) => line.trim() !== ""); // Remove blank or whitespace-only lines

    // Check if there are any non-blank lines
    if (nonBlankLines.length === 0) {
      props.showAlert(
        "No content to number after removing blank lines!",
        "warning"
      );
      return;
    }

    // Remove existing line numbers (handles repeated numbering issue)
    const cleanedLines = nonBlankLines.map((line) =>
      line.replace(/^\d+\.\s*/, "")
    );

    // Add line numbers to the cleaned lines
    const numberedText = cleanedLines
      .map((line, index) => `${index + 1}. ${line}`) // Add numbers
      .join("\n"); // Join them back into a single string

    // Save current state to history
    saveToHistory(text);

    // Update the text state with the new numbered text
    setText(numberedText);

    props.showAlert("Line numbers added successfully!", "success");
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
    props.showAlert("List sorted!", "success");
  };

  // // Undo the last change
  // const handleUndo = () => {
  //   if (history.length > 0) {
  //     setText(history[history.length - 1]);
  //     setHistory(history.slice(0, -1));
  //     props.showAlert("Undone!", "success");
  //   } else {
  //     props.showAlert("Nothing to undo!", "warning");
  //   }
  // };

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

  //  PASTE FN
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        console.log("Clipboard API is supported.");
        // Modern Clipboard API
        const clipboardText = await navigator.clipboard.readText();
        console.log("Clipboard Text: ", clipboardText);

        if (!clipboardText) {
          props.showAlert("Clipboard is empty!", "warning");
          return;
        }

        saveToHistory(text); // Save the current text before updating
        setText((prevText) => prevText + clipboardText);
        props.showAlert("Text pasted from clipboard!", "success");
      } else {
        console.log("Clipboard API is not supported, using fallback.");
        // Fallback for older browsers
        fallbackPaste();
      }
    } catch (error) {
      console.error("Failed to access clipboard:", error);
      fallbackPaste(); // Attempt fallback if Clipboard API fails
    }
  };

  const fallbackPaste = () => {
    try {
      const textArea = document.createElement("textarea");
      document.body.appendChild(textArea);
      textArea.focus();
      document.execCommand("paste"); // Pasting clipboard content into textarea

      const clipboardText = textArea.value;
      console.log("Clipboard Text from Fallback: ", clipboardText);

      document.body.removeChild(textArea);

      if (clipboardText) {
        saveToHistory(text); // Save the current text before updating
        setText((prevText) => prevText + clipboardText);
        props.showAlert("Text pasted using fallback method!", "success");
      } else {
        props.showAlert("Clipboard is empty or inaccessible!", "warning");
      }
    } catch (error) {
      console.error("Fallback paste failed:", error);
      props.showAlert(
        "Clipboard API is not supported and fallback paste failed. Please check browser compatibility.",
        "danger"
      );
    }
  };

  // Count words, characters, and letters
  const wordCount = text.split(/\s+/).filter((el) => el.length !== 0).length;
  const charCount = text.length;
  const letterCount = text
    .split("")
    .filter((char) => /[a-zA-Z]/.test(char)).length;

  const sentenceCount = text
    .split(/[.!?]+/)
    .filter((el) => el.trim() !== "").length;
  const paragraphCount = text
    .split(/\n+/)
    .filter((el) => el.trim() !== "").length;

  // Read alod functionality
  const handleReadAloud = () => {
    if (text.trim() === "") {
      props.showAlert("No text to read!", "warning");
      return;
    }

    // Create a new SpeechSynthesisUtterance (text-to-speech object)
    const speech = new SpeechSynthesisUtterance(text);

    // Optional: Customize the speech properties
    speech.rate = 1; // Speed of speech (1 is normal)
    speech.pitch = 1; // Pitch (1 is normal)
    speech.volume = 1; // Volume (1 is full volume)

    // Event listener when the speech ends
    speech.onend = () => {
      setIsReading(false); // Reset state when reading ends
    };

    // Event listener when the speech starts
    speech.onstart = () => {
      setIsReading(true); // Mark as reading when speech starts
    };

    // Speak the text
    window.speechSynthesis.speak(speech);
    props.showAlert("Reading aloud!", "success");
  };

  const handleStop = () => {
    if (isReading) {
      window.speechSynthesis.cancel(); // Stops the speech immediately
      props.showAlert("Reading stopped!", "warning");
      setIsReading(false); // Reset reading state
    } else {
      props.showAlert("No speech is being read", "info"); // If nothing is being read
    }
  };

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
          onChange={handleTextChange}
          id="myBox"
          rows="8"
          style={{
            backgroundColor: props.mode === "dark" ? "#0f1118" : "#ebdfdf",
            color: props.mode === "dark" ? "white" : "#042743",
            borderColor: props.mode === "dark" ? "white" : "#042743",
          }}
        ></textarea>

        <div className="find-replace-section">
          <input
            type="text"
            placeholder="Find"
            value={findValue}
            onChange={handleFindChange}
            // onChange={(e) => setText(e.target.value)}
            className={`form-control mb-2 ${
              props.mode === "dark" ? "dark-placeholder" : "light-placeholder"
            }`}
            style={{
              backgroundColor: props.mode === "dark" ? "#0f1118" : "#ebdfdf",
              color: props.mode === "dark" ? "white" : "#042743",
              borderColor: props.mode === "dark" ? "white" : "#042743",
              marginTop: 7,
            }}
          />
          <input
            type="text"
            placeholder="Replace"
            value={replaceValue}
            onChange={handleReplaceChange}
            className={`form-control mb-2 ${
              props.mode === "dark" ? "dark-placeholder" : "light-placeholder"
            }`}
            style={{
              backgroundColor: props.mode === "dark" ? "#0f1118" : "#ebdfdf",
              color: props.mode === "dark" ? "white" : "#042743",
              borderColor: props.mode === "dark" ? "white" : "#042743",
              marginTop: 7,
            }}
          />
          <Button
            text="Find and Replace"
            onClick={handleFindAndReplace}
            mode={props.mode}
          />
          {/* </div> */}
        </div>

        <Button
          text="To Upper Case"
          onClick={hanldeUpClick}
          mode={props.mode}
        />
        <Button
          text="To Lower Case"
          onClick={hanldeLowClick}
          mode={props.mode}
        />
        <Button
          text="Sort Lines"
          onClick={handleSortButtonClick}
          mode={props.mode}
        />
        <Button text="Capitalize" onClick={capital} mode={props.mode} />
        <Button
          text="Add Line Numbers"
          onClick={handleAddLineNumbers}
          mode={props.mode}
        />
        <Button
          text="Remove Extra Space"
          onClick={rmvExtraSpc}
          mode={props.mode}
        />
        <Button
          text="Remove Special Characters"
          onClick={removeSpecialCharacters}
          mode={props.mode}
        />

        <Button text="Encrypt Text" onClick={handleEncrypt} mode={props.mode} />
        <Button text="Decrypt Text" onClick={handleDecrypt} mode={props.mode} />
        <Button
          text={isReading ? "Stop Reading" : "Start Reading"}
          onClick={isReading ? handleStop : handleReadAloud}
          mode={props.mode}
          disabled={text.trim() === ""}
        />
        <Button text="Paste" onClick={handlePaste} mode={props.mode} />
        <Button text="Copy" onClick={copyy} mode={props.mode} />
        <Button text="Undo" onClick={handleUndo} mode={props.mode} /> 
         <Button text="Redo" onClick={handleRedo} mode={props.mode} />
        {/* <button
          className="btn btn-sm btn-primary  mx-1"
          type="button"
          onClick={clearr}
          mode={props.mode}
        >
          Undo
        </button>
        <button
          className="btn btn-sm btn-primary  mx-1"
          type="button"
          onClick={clearr}
          mode={props.mode}
        >
          Redo
        </button> */}
        <button
          className="btn btn-sm btn-danger  mx-1"
          type="button"
          onClick={clearr}
          mode={props.mode}
        >
          Clear
        </button>

        <div className="btn-group mx-1">
          <button
            className="btn btn-sm btn-warning dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Download As
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleDownloadAs("pdf")}
              >
                PDF
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleDownloadAs("word")}
              >
                Word
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleDownloadAs("text")}
              >
                Text
              </button>
            </li>
          </ul>
        </div>

        <div className="btn-group mx-1">
          <button
            className="btn btn-sm btn-success dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Share
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleShare("gmail")}
              >
                Mail
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleShare("whatsapp")}
              >
                WhatsApp
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleShare("x")}
              >
                X (Twitter)
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="container mt-4"
        style={{
          color: props.mode === "dark" ? "white" : "#042743",
        }}
      >
        <h4>Text Summary</h4>
        <p>
          {wordCount} words, {letterCount} letters, {charCount} characters,{" "}
          {sentenceCount} sentence(s), and {paragraphCount} paragraph(s)
        </p>
        <p>{0.008 * wordCount} Minutes read</p>
      </div>
    </>
  );
}

