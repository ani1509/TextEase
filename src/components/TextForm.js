import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { QRCodeCanvas } from "qrcode.react"; // Import QR Code generator
import CryptoJS from "crypto-js";
import Button from "./Button"; // Import the Button component
import HTMLDocx from "html-docx-js/dist/html-docx";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation

import { toCanvas } from "qrcode"; // Import QR Code generator function

export default function TextForm({ mode, showAlert, heading }) {
  const textAreaRef = useRef(null);
  const qrRef = useRef(null); // Create a ref for the QRCodeCanvas

  const [text, setText] = useState("");
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [history, setHistory] = useState([]); // History stack to store previous states
  const [redoHistory, setRedoHistory] = useState([]); // Redo stack to store undone actions
  const [isReading, setIsReading] = useState(false); // Track if reading is in progress
  const [qrText, setQrText] = useState("");

  // Handle text changes in the main textarea
  const handleTextChange = (event) => {
    // Save current text to history before updating
    setHistory([...history, text]);
    setText(event.target.value);
    setRedoHistory([]); // Clear redo history whenever new text is typed
  };

  // const handleGenerateQR = () => {
  const handleGenerateQR = useCallback(() => {
    if (text.trim() === "") {
      showAlert("Enter some text to generate QR Code!", "warning");
      return;
    }

    if (qrText) {
      // If QR is already generated, remove it
      setQrText("");
      showAlert("QR Code Removed!", "warning");
    } else if (text.trim()) {
      setQrText(text); // Generate QR only if text is not empty
    } else {
      setQrText(text);
      showAlert("QR Code Generated!", "success");
    }
  }, [text, showAlert, qrText]); // Dependencies

  // };

  // Share options for Gmail, WhatsApp, and X

  const handleShare = (platform) => {
    if (!text) {
      showAlert("No text to share!", "warning");
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
    showAlert("Sharing initiated!", "success");
  };

  // const handleDownloadAs = (format) => {
  //   if (!text) {
  //     showAlert("No text to download!", "warning");
  //     return;
  //   }

  //   if (format === "pdf") {
  //     const doc = new jsPDF();
  //     doc.text(text, 10, 10);
  //     doc.save("document.pdf");
  //     showAlert("PDF file is ready for download!", "success");
  //   } else if (format === "word") {
  //     const content = `<html><body><p>${text}</p></body></html>`;
  //     const converted = HTMLDocx.asBlob(content);
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(converted);
  //     link.download = "document.docx";
  //     link.click();
  //     showAlert("Word file is ready for download!", "success");
  //   } else if (format === "text") {
  //     const blob = new Blob([text], { type: "text/plain" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = "document.txt";
  //     link.click();
  //     showAlert("Text file is ready for download!", "success");
  //   } else if (format === "qr") {
  //     if (!qrText) {
  //       showAlert("No QR code to download!", "warning");
  //       return;
  //     }
  //     const canvas = document.querySelector("canvas"); // Get QR code canvas
  //     const qrImage = canvas.toDataURL("image/png"); // Convert to image
  //     const link = document.createElement("a");
  //     link.href = qrImage;
  //     link.download = "QRCode.png";
  //     link.click();
  //     showAlert("QR Code downloaded!", "success");
  //   }
  // };

  // const handleDownloadAs = (format) => {
  //   if (!text) {
  //     showAlert("No text to download!", "warning");
  //     return;
  //   }

  //   if (format === "pdf") {
  //     const doc = new jsPDF();
  //     doc.text(text, 10, 10);
  //     doc.save("document.pdf");
  //     showAlert("PDF file is ready for download!", "success");
  //   } else if (format === "word") {
  //     const content = `<html><body><p>${text}</p></body></html>`;
  //     const converted = HTMLDocx.asBlob(content);
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(converted);
  //     link.download = "document.docx";
  //     link.click();
  //     showAlert("Word file is ready for download!", "success");
  //   } else if (format === "text") {
  //     const blob = new Blob([text], { type: "text/plain" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = "document.txt";
  //     link.click();
  //     showAlert("Text file is ready for download!", "success");
  //   } else if (format === "qr") {
  //     if (!qrText) {
  //       showAlert("No QR code to download!", "warning");
  //       return;
  //     }

  //     const canvas = qrRef.current.querySelector("canvas"); // Get the QR code canvas
  //     if (canvas) {
  //       const qrImage = canvas.toDataURL("image/png"); // Convert to image
  //       const link = document.createElement("a");
  //       link.href = qrImage;
  //       link.download = "QRCode.png";
  //       link.click();
  //       showAlert("QR Code downloaded!", "success");
  //     } else {
  //       showAlert("QR Code generation failed!", "error");
  //     }
  //   }
  // };

  // const handleDownloadAs = (format) => {
  //   if (!text) {
  //     showAlert("No text to download!", "warning");
  //     return;
  //   }

  //   if (format === "pdf") {
  //     const doc = new jsPDF();
  //     doc.text(text, 10, 10);
  //     doc.save("document.pdf");
  //     showAlert("PDF file is ready for download!", "success");
  //   } else if (format === "word") {
  //     const content = `<html><body><p>${text}</p></body></html>`;
  //     const converted = HTMLDocx.asBlob(content);
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(converted);
  //     link.download = "document.docx";
  //     link.click();
  //     showAlert("Word file is ready for download!", "success");
  //   } else if (format === "text") {
  //     const blob = new Blob([text], { type: "text/plain" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = "document.txt";
  //     link.click();
  //     showAlert("Text file is ready for download!", "success");
  //   } else if (format === "qr") {
  //     if (!qrText) {
  //       showAlert("No QR code to download!", "warning");
  //       return;
  //     }

  //     const canvas = qrRef.current.querySelector("canvas"); // Get QR code canvas
  //     if (!canvas) {
  //       showAlert("QR code generation failed!", "error");
  //       return;
  //     }

  //     const qrImage = canvas.toDataURL("image/png", 1.0); // 1.0 ensures best quality
  //     const link = document.createElement("a");
  //     link.href = qrImage;
  //     link.download = "QRCode.png";
  //     link.click();

  //     showAlert("QR Code downloaded!", "success");
  //   }
  // };

  // Handle Undo functionality

  const handleDownloadAs = (format) => {
    if (!text.trim()) {
      showAlert("No text to download!", "warning");
      return;
    }

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.text(text, 10, 10);
      doc.save("document.pdf");
      showAlert("PDF file is ready for download!", "success");
    } else if (format === "word") {
      const content = `<html><body><p>${text}</p></body></html>`;
      const converted = HTMLDocx.asBlob(content);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(converted);
      link.download = "document.docx";
      link.click();
      showAlert("Word file is ready for download!", "success");
    } else if (format === "text") {
      const blob = new Blob([text], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "document.txt";
      link.click();
      showAlert("Text file is ready for download!", "success");
    } else if (format === "qr") {
      if (!text.trim()) {
        showAlert("No text available to generate QR code!", "warning");
        return;
      }

      // Generate a fresh QR code dynamically
      const qrCanvas = document.createElement("canvas");
      toCanvas(qrCanvas, text, { width: 300 }, (error) => {
        if (error) {
          showAlert("QR Code generation failed!", "danger");
          return;
        }

        // Convert QR code to image
        const qrImage = qrCanvas.toDataURL("image/png", 1.0); // Ensure high quality
        const link = document.createElement("a");
        link.href = qrImage;
        link.download = "QRCode.png";
        link.click();
        showAlert("QR Code downloaded!", "success");
      });
    }
  };

  // const handleUndo = () => {
  //   if (history.length > 0) {
  //     const previousText = history[history.length - 1];
  //     setRedoHistory([text, ...redoHistory]); // Store current text in redo stack
  //     setText(previousText);
  //     setHistory(history.slice(0, -1)); // Remove last entry from history stack
  //     showAlert("Undone!", "success");
  //   } else {
  //     showAlert("Nothing to undo!", "warning");
  //   }
  // };

  // Handle Redo functionality

  // const handleRedo = () => {
  //   if (redoHistory.length > 0) {
  //     const redoText = redoHistory[0];
  //     setHistory([...history, text]); // Store current text in undo history
  //     setText(redoText);
  //     setRedoHistory(redoHistory.slice(1)); // Remove the first entry from redo stack
  //     showAlert("Redone!", "success");
  //   } else {
  //     showAlert("Nothing to redo!", "warning");
  //   }
  // };

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
      showAlert("Please enter text to find!", "warning");
      return;
    }

    // Escape special characters in findValue for regex handling
    const escapedFindValue = findValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Create a global regex for finding all occurrences of findValue, including special characters
    const regex = new RegExp(escapedFindValue, "g");

    // Check if the findValue exists in the text
    if (!regex.test(text)) {
      showAlert(`"${findValue}" not found in the text!`, "warning");
      return;
    }

    // Save current state to history before making changes
    saveToHistory(text);

    // Replace all occurrences of the findValue with replaceValue
    const updatedText = text.replace(regex, replaceValue);

    // Update the text with the replaced value
    setText(updatedText);

    // Show success alert
    showAlert("Find and Replace completed!", "success");
  };

  // Save current text to history
  // const saveToHistory = (currentText) => {
  //   setHistory([...history, currentText]);
  // };

  const saveToHistory = useCallback(
    (currentText) => {
      setHistory((prevHistory) => [...prevHistory, currentText]);
    },
    [setHistory] //  Added setHistory as a dependency
  );

  // Convert text to uppercase
  const hanldeUpClick = () => {
    if (!text) {
      showAlert("Nothing to convert to uppercase!", "warning");
      return;
    }
    saveToHistory(text);
    setText(text.toUpperCase());
    showAlert("Changed to uppercase!", "success");
  };

  // Convert text to lowercase
  const hanldeLowClick = () => {
    if (!text) {
      showAlert("Nothing to convert to lowercase!", "warning");
      return;
    }
    saveToHistory(text);
    setText(text.toLowerCase());
    showAlert("Changed to lowercase!", "success");
  };

  // Capitalize first letter of each word
  const capital = () => {
    if (!text) {
      showAlert("Nothing to capitalize!", "warning");
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
    showAlert("Capitalized!", "success");
  };

  const removeNumbers = () => {
    if (!text) {
      showAlert("Nothing to process!", "warning");
      return;
    }
    saveToHistory(text);
    const textWithoutNumbers = text.replace(/\d+/g, ""); // Removes all numbers
    setText(textWithoutNumbers);
    showAlert("Numbers removed!", "success");
  };

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
    showAlert("Unnecessary special characters removed!", "success");
  };

  // Fallback method using execCommand
  // const fallbackCopyToClipboard = (text) => {
  //   try {
  //     const textArea = document.createElement("textarea");
  //     textArea.value = text;
  //     textArea.style.position = "fixed"; // Prevent scrolling to bottom
  //     textArea.style.opacity = "0"; // Hide the textarea
  //     document.body.appendChild(textArea);
  //     textArea.focus();
  //     textArea.select();

  //     const successful = document.execCommand("copy");
  //     document.body.removeChild(textArea);

  //     if (successful) {
  //       showAlert("Text copied to clipboard!", "success");
  //     } else {
  //       showAlert("Failed to copy text!", "danger");
  //     }
  //   } catch (err) {
  //     console.error("Fallback copy failed:", err);
  //     showAlert("Copying is not supported on this device!", "danger");
  //   }
  // };

  const fallbackCopyToClipboard = useCallback(
    (text) => {
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
          showAlert("Text copied to clipboard!", "success");
        } else {
          showAlert("Failed to copy text!", "danger");
        }
      } catch (err) {
        console.error("Fallback copy failed:", err);
        showAlert("Copying is not supported on this device!", "danger");
      }
    },
    [showAlert]
  ); //  Wrapped inside useCallback & added `showAlert` as a dependency

  // Copy text to clipboard
  // const copyy = () => {
  const copyy = useCallback(() => {
    if (!text) {
      showAlert("Nothing to copy!", "warning");
      return;
    }

    // Check if navigator.clipboard exists
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showAlert("Text copied to clipboard!", "success");
        })
        .catch((err) => {
          console.error("Clipboard API failed:", err);
          fallbackCopyToClipboard(text);
        });
    } else {
      // Fallback for unsupported browsers
      fallbackCopyToClipboard(text);
    }
  }, [text, showAlert, fallbackCopyToClipboard]);

  // };

  // Clear text
  // const clearr = () => {
  const clearr = useCallback(() => {
    if (!text) {
      showAlert("Nothing to clear!", "warning");
      return;
    }
    saveToHistory(text);
    setText("");
    showAlert("Text cleared!", "success");

    // };
  }, [setText, showAlert, text, saveToHistory]);

  // Remove extra spaces
  const rmvExtraSpc = () => {
    if (!text) {
      showAlert("Nothing to process !", "warning");
      return;
    }
    saveToHistory(text);
    setText(text.split(/[ ]+/).join(" "));
    showAlert("Removed extra spaces!", "success");
  };

  // Add numbering to list
  const handleAddLineNumbers = () => {
    // Remove extra blank lines and split into lines
    const nonBlankLines = text
      .split("\n") // Split text into lines
      .filter((line) => line.trim() !== ""); // Remove blank or whitespace-only lines

    // Check if there are any non-blank lines
    if (nonBlankLines.length === 0) {
      showAlert("No content to number after removing blank lines!", "warning");
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

    showAlert("Line numbers added successfully!", "success");
  };

  // Sort text alphabetically
  const handleSortButtonClick = () => {
    if (!text) {
      showAlert("Nothing to sort!", "warning");
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
    showAlert("List sorted!", "success");
  };

  // Encrypt the text
  const handleEncrypt = () => {
    if (!text) {
      showAlert("Please enter text to encrypt!", "warning");
      return;
    }
    const secretKey = prompt("Enter a secret key for encryption:");
    if (secretKey) {
      const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
      saveToHistory(text);
      setText(encryptedText);
      showAlert("Text encrypted!", "success");
    } else {
      showAlert("Encryption key is required!", "danger");
    }
  };

  // Decrypt the text
  const handleDecrypt = () => {
    if (!text) {
      showAlert("Please enter text to decrypt!", "warning");
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
        showAlert("Text decrypted!", "success");
      } catch (error) {
        showAlert("Invalid key or corrupted text!", "danger");
      }
    } else {
      showAlert("Decryption key is required!", "danger");
    }
  };

  //  PASTE FN
  // const handlePaste = async () => {
  //   const handlePaste = useCallback(async () => {
  //   try {
  //     if (navigator.clipboard && navigator.clipboard.readText) {
  //       console.log("Clipboard API is supported.");
  //       // Modern Clipboard API
  //       const clipboardText = await navigator.clipboard.readText();
  //       console.log("Clipboard Text: ", clipboardText);

  //       if (!clipboardText) {
  //         showAlert("Clipboard is empty!", "warning");
  //         return;
  //       }

  //       saveToHistory(text); // Save the current text before updating
  //       setText((prevText) => prevText + clipboardText);
  //       showAlert("Text pasted from clipboard!", "success");
  //     } else {
  //       console.log("Clipboard API is not supported, using fallback.");
  //       // Fallback for older browsers
  //       fallbackPaste();
  //     }
  //   } catch (error) {
  //     console.error("Failed to access clipboard:", error);
  //     fallbackPaste(); // Attempt fallback if Clipboard API fails
  //   }
  //     }, [setText, showAlert, saveToHistory, text, fallbackPaste]);

  // // };

  // const fallbackPaste = () => {
  //   try {
  //     const textArea = document.createElement("textarea");
  //     document.body.appendChild(textArea);
  //     textArea.focus();
  //     document.execCommand("paste"); // Pasting clipboard content into textarea

  //     const clipboardText = textArea.value;
  //     console.log("Clipboard Text from Fallback: ", clipboardText);

  //     document.body.removeChild(textArea);

  //     if (clipboardText) {
  //       saveToHistory(text); // Save the current text before updating
  //       setText((prevText) => prevText + clipboardText);
  //       showAlert("Text pasted using fallback method!", "success");
  //     } else {
  //       showAlert("Clipboard is empty or inaccessible!", "warning");
  //     }
  //   } catch (error) {
  //     console.error("Fallback paste failed:", error);
  //     showAlert(
  //       "Clipboard API is not supported and fallback paste failed. Please check browser compatibility.",
  //       "danger"
  //     );
  //   }
  // };

  //  Wrapped fallbackPaste in useCallback to avoid re-renders
  const fallbackPaste = useCallback(() => {
    try {
      const textArea = document.createElement("textarea");
      document.body.appendChild(textArea);
      textArea.focus();
      document.execCommand("paste"); // Pasting clipboard content into textarea

      const clipboardText = textArea.value;
      console.log("Clipboard Text from Fallback: ", clipboardText);

      document.body.removeChild(textArea);

      if (clipboardText) {
        saveToHistory(text); // Save current text before updating
        setText((prevText) => prevText + clipboardText);
        showAlert("Text pasted using fallback method!", "success");
      } else {
        showAlert("Clipboard is empty or inaccessible!", "warning");
      }
    } catch (error) {
      console.error("Fallback paste failed:", error);
      showAlert(
        "Clipboard API is not supported and fallback paste failed. Please check browser compatibility.",
        "danger"
      );
    }
  }, [setText, showAlert, saveToHistory, text]); //  Ensures proper dependency handling

  const handlePaste = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        console.log("Clipboard API is supported.");
        // Modern Clipboard API
        const clipboardText = await navigator.clipboard.readText();
        console.log("Clipboard Text: ", clipboardText);

        if (!clipboardText) {
          showAlert("Clipboard is empty!", "warning");
          return;
        }

        saveToHistory(text); // Save current text before updating
        setText((prevText) => prevText + clipboardText);
        showAlert("Text pasted from clipboard!", "success");
      } else {
        console.log("Clipboard API not supported, using fallback.");
        fallbackPaste(); // Call the fallback method
      }
    } catch (error) {
      console.error("Failed to access clipboard:", error);
      fallbackPaste(); // Fallback if Clipboard API fails
    }
  }, [setText, showAlert, saveToHistory, text, fallbackPaste]);

  // Count words, characters, and letters
  // const wordCount = text.split(/\s+/).filter((el) => el.length !== 0).length;
  // const charCount = text.length;
  // const letterCount = text
  //   .split("")
  //   .filter((char) => /[a-zA-Z]/.test(char)).length;

  // const sentenceCount = text
  //   .split(/[.!?]+/)
  //   .filter((el) => el.trim() !== "").length;
  // const paragraphCount = text
  //   .split(/\n+/)
  //   .filter((el) => el.trim() !== "").length;

  const wordCount = useMemo(
    () => text.split(/\s+/).filter((el) => el.length !== 0).length,
    [text]
  );
  const charCount = useMemo(() => text.length, [text]);
  const letterCount = useMemo(
    () => text.split("").filter((char) => /[a-zA-Z]/.test(char)).length,
    [text]
  );
  const sentenceCount = useMemo(
    () => text.split(/[.!?]+/).filter((el) => el.trim() !== "").length,
    [text]
  );
  const paragraphCount = useMemo(
    () => text.split(/\n+/).filter((el) => el.trim() !== "").length,
    [text]
  );

  // Read alod functionality
  // const handleReadAloud = () => {
  const handleReadAloud = useCallback(() => {
    if (text.trim() === "") {
      showAlert("No text to read!", "warning");
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
    showAlert("Reading aloud!", "success");
  }, [text, showAlert]);

  // };

  const handleStop = () => {
    if (isReading) {
      window.speechSynthesis.cancel(); // Stops the speech immediately
      showAlert("Reading stopped!", "warning");
      setIsReading(false); // Reset reading state
    } else {
      showAlert("No speech is being read", "info"); // If nothing is being read
    }
  };

  const ToWords = useCallback(() => {
    // const ToWords = () => {
    if (!text) {
      showAlert("Nothing to convert!", "warning");
      return;
    }
    saveToHistory(text);

    // Function to convert numbers to Indian numbering words
    const numberToWordsIndian = (num) => {
      if (num === 0) return "Zero";

      const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];

      function convertLessThanThousand(n) {
        let result = "";

        if (n >= 100) {
          result += ones[Math.floor(n / 100)] + " Hundred ";
          n %= 100;
        }

        if (n > 0 && n <= 19) {
          // 🔹 Fix: Ensures `10` correctly maps to "Ten"
          result += ones[n] + " ";
        } else if (n >= 20) {
          result += tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
        }

        return result.trim();
      }

      let parts = [];

      if (num >= 10000000) {
        // Crore
        parts.push(
          convertLessThanThousand(Math.floor(num / 10000000)) + " Crore"
        );
        num %= 10000000;
      }
      if (num >= 100000) {
        // Lakh
        parts.push(convertLessThanThousand(Math.floor(num / 100000)) + " Lakh");
        num %= 100000;
      }
      if (num >= 1000) {
        // Thousand
        parts.push(
          convertLessThanThousand(Math.floor(num / 1000)) + " Thousand"
        );
        num %= 1000;
      }
      if (num > 0) {
        parts.push(convertLessThanThousand(num));
      }

      return parts.join(" ").trim() + " Only";
    };

    // Replace numbers with their word equivalents
    const textWithWords = text.replace(/\d+/g, (match) =>
      numberToWordsIndian(parseInt(match, 10))
    );

    setText(textWithWords);
    showAlert("Numbers converted to words!", "success");
  }, [text, showAlert, saveToHistory]);

  // };

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     const isAltKey = event.altKey || event.getModifierState("AltGraph");

  //     if (isAltKey && event.key.toLowerCase() === "c") {
  //       event.preventDefault();
  //       copyy();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "z") {
  //       event.preventDefault();
  //       handleUndo();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "y") {
  //       event.preventDefault();
  //       handleRedo();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "v") {
  //       event.preventDefault();
  //       handlePaste();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "w") {
  //       event.preventDefault();
  //       ToWords();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "k") {
  //       event.preventDefault();
  //       clearr();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "s") {
  //       event.preventDefault();
  //       handleReadAloud();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "p") {
  //       event.preventDefault();
  //       if (textAreaRef.current) {
  //         textAreaRef.current.focus();
  //       }
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  //   // eslint-disable-next-line
  // }, [ToWords,clearr,handlePaste,handleRedo,handleUndo,handleReadAloud]);

  // const handleKeyDown = useCallback(
  //   (event) => {
  //     const isAltKey = event.altKey || event.getModifierState("AltGraph");

  //     if (isAltKey && event.key.toLowerCase() === "c") {
  //       event.preventDefault();
  //       copyy();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "z") {
  //       event.preventDefault();
  //       handleUndo();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "y") {
  //       event.preventDefault();
  //       handleRedo();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "v") {
  //       event.preventDefault();
  //       handlePaste();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "w") {
  //       event.preventDefault();
  //       ToWords();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "k") {
  //       event.preventDefault();
  //       clearr();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "s") {
  //       event.preventDefault();
  //       handleReadAloud();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "q") {
  //       event.preventDefault();
  //       handleGenerateQR();
  //     }
  //     if (isAltKey && event.key.toLowerCase() === "p") {
  //       event.preventDefault();
  //       if (textAreaRef.current) {
  //         textAreaRef.current.focus();
  //       }
  //     }
  //   },
  //   [
  //     copyy,
  //     handleUndo,
  //     handleRedo,
  //     handlePaste,
  //     ToWords,
  //     clearr,
  //     handleReadAloud,
  //   ]
  // );

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [handleKeyDown]);

  // const handleKeyDown = useCallback(
  //   (event) => {
  //     const isAltKey = event.altKey || event.getModifierState("AltGraph");

  //     const keyActions = {
  //       c: copyy,
  //       z: handleUndo,
  //       y: handleRedo,
  //       v: handlePaste,
  //       w: ToWords,
  //       k: clearr,
  //       s: handleReadAloud,
  //       q: handleGenerateQR,
  //       p: () => textAreaRef.current?.focus(),
  //     };

  //     const action = keyActions[event.key.toLowerCase()];
  //     if (isAltKey && action) {
  //       event.preventDefault();
  //       action();
  //     }
  //   },
  //   [
  //     copyy,
  //     handleUndo,
  //     handleRedo,
  //     handlePaste,
  //     ToWords,
  //     clearr,
  //     handleReadAloud,
  //     handleGenerateQR,
  //   ]
  // );

  // // Global event listener (Attaches only ONCE)
  // useEffect(() => {
  //   const keyDownHandler = (event) => {
  //     handleKeyDown(event);
  //   };

  //   window.addEventListener("keydown", keyDownHandler);

  //   return () => {
  //     window.removeEventListener("keydown", keyDownHandler);
  //   };
  // }, []);

  //  Memoized function to generate or remove QR
  // const handleGenerateQR = useCallback(() => {
  //   if (text.trim() === "") {
  //     showAlert("Enter some text to generate QR Code!", "warning");
  //     return;
  //   }

  //   setQrText((prevText) => (prevText ? "" : text)); // Toggle QR Code
  //   showAlert(
  //     prevText ? "QR Code Removed!" : "QR Code Generated!",
  //     "success"
  //   );
  // }, [text, showAlert]); // Dependencies

  //  Memoized function to handle undo
  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      const previousText = history.pop();
      setRedoHistory([text, ...redoHistory]); // Store current text in redo stack
      setText(previousText);
      setHistory([...history]); // Update history state
      showAlert("Undone!", "success");
    } else {
      showAlert("Nothing to undo!", "warning");
    }
  }, [history, text, redoHistory, setHistory, setRedoHistory, showAlert]);

  //  Memoized function to handle redo
  const handleRedo = useCallback(() => {
    if (redoHistory.length > 0) {
      const nextText = redoHistory.shift();
      setHistory([...history, text]); // Save current text to history
      setText(nextText);
      setRedoHistory([...redoHistory]); // Update redo state
      showAlert("Redone!", "success");
    } else {
      showAlert("Nothing to redo!", "warning");
    }
  }, [history, redoHistory, text, setHistory, setRedoHistory, showAlert]);

  //  Memoized function to copy text
  // const copyy = useCallback(() => {
  //   navigator.clipboard.writeText(text);
  //   showAlert("Text copied to clipboard!", "success");
  // }, [text, showAlert]);

  //  Memoized function to clear text
  // const clearr = useCallback(() => {
  //   setText("");
  //   setHistory([]);
  //   setRedoHistory([]);
  //   showAlert("Text cleared!", "success");
  // }, [setText, setHistory, setRedoHistory, showAlert]);

  //  Memoized function to paste text
  // const handlePaste = useCallback(async () => {
  //   const pastedText = await navigator.clipboard.readText();
  //   setText((prevText) => prevText + pastedText);
  //   showAlert("Text pasted!", "success");
  // }, [setText, showAlert]);

  //  Memoized function to read text aloud
  // const handleReadAloud = useCallback(() => {
  //   const speech = new SpeechSynthesisUtterance(text);
  //   window.speechSynthesis.speak(speech);
  //   showAlert("Reading text aloud...", "success");
  // }, [text, showAlert]);

  //  Memoized function to convert text to words
  // const ToWords = useCallback(() => {
  //   if (!text) {
  //     showAlert("Nothing to convert!", "warning");
  //     return;
  //   }
  //   setText(convertToWords(text)); // Assume `convertToWords` is a function that converts numbers to words
  //   showAlert("Numbers converted to words!", "success");
  // }, [text, showAlert]);

  //  Memoized key event handler
  const handleKeyDown = useCallback(
    (event) => {
      const isAltKey = event.altKey || event.getModifierState("AltGraph");

      const keyActions = {
        c: copyy,
        z: handleUndo,
        y: handleRedo,
        v: handlePaste,
        w: ToWords,
        k: clearr,
        s: handleReadAloud,
        q: handleGenerateQR,
        p: () => textAreaRef.current?.focus(),
      };

      const action = keyActions[event.key.toLowerCase()];
      if (isAltKey && action) {
        event.preventDefault();
        action();
      }
    },
    [
      copyy,
      handleUndo,
      handleRedo,
      handlePaste,
      ToWords,
      clearr,
      handleReadAloud,
      handleGenerateQR,
    ]
  );

  //  Attach global event listener ONCE
  useEffect(() => {
    const keyDownHandler = (event) => {
      handleKeyDown(event);
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [handleKeyDown]); //  Now we safely include `handleKeyDown` in dependencies

  return (
    <>
      <div
        className="container"
        style={{
          color: mode === "dark" ? "white" : "#042743",
        }}
      >
        <h4>{heading}</h4>

        <textarea
          className="form-control"
          value={text}
          onChange={handleTextChange}
          id="myBox"
          rows="8"
          ref={textAreaRef} // Reference to access the textarea
          autoFocus // Automatically focuses on the textarea when the page loads
          style={{
            backgroundColor: mode === "dark" ? "#0f1118" : "#ebdfdf",
            color: mode === "dark" ? "white" : "#042743",
            borderColor: mode === "dark" ? "white" : "#042743",
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
              mode === "dark" ? "dark-placeholder" : "light-placeholder"
            }`}
            style={{
              backgroundColor: mode === "dark" ? "#0f1118" : "#ebdfdf",
              color: mode === "dark" ? "white" : "#042743",
              borderColor: mode === "dark" ? "white" : "#042743",
              marginTop: 7,
            }}
          />
          <input
            type="text"
            placeholder="Replace"
            value={replaceValue}
            onChange={handleReplaceChange}
            className={`form-control mb-2 ${
              mode === "dark" ? "dark-placeholder" : "light-placeholder"
            }`}
            style={{
              backgroundColor: mode === "dark" ? "#0f1118" : "#ebdfdf",
              color: mode === "dark" ? "white" : "#042743",
              borderColor: mode === "dark" ? "white" : "#042743",
              marginTop: 7,
            }}
          />

          <Button
            text="Find and Replace"
            onClick={handleFindAndReplace}
            mode={mode}
          />
        </div>

        <Button text="To Upper Case" onClick={hanldeUpClick} mode={mode} />
        <Button text="To Lower Case" onClick={hanldeLowClick} mode={mode} />
        <Button text="Sort Lines" onClick={handleSortButtonClick} mode={mode} />
        <Button text="Capitalize" onClick={capital} mode={mode} />
        <Button text="Remove Numbers" onClick={removeNumbers} mode={mode} />
        <Button
          text="Add Line Numbers"
          onClick={handleAddLineNumbers}
          mode={mode}
        />
        <Button text="Remove Extra Space" onClick={rmvExtraSpc} mode={mode} />
        <Button
          text="Remove Special Characters"
          onClick={removeSpecialCharacters}
          mode={mode}
        />
        <Button text="Amount in Words" onClick={ToWords} mode={mode} />
        <Button text="Encrypt Text" onClick={handleEncrypt} mode={mode} />
        <Button text="Decrypt Text" onClick={handleDecrypt} mode={mode} />

        <Button
          text={isReading ? "Stop Reading" : "Start Reading"}
          onClick={isReading ? handleStop : handleReadAloud}
          mode={mode}
          disabled={text.trim() === ""}
        />

        <Button
          text={
            text.trim()
              ? qrText
                ? "Remove QR Code"
                : "Generate QR Code"
              : "Generate QR Code"
          }
          // text={qrText ? "Remove QR Code" : "Generate QR Code"}
          onClick={handleGenerateQR}
          mode={mode}
        />

        <Button text="Paste" onClick={handlePaste} mode={mode} />
        <Button text="Copy" onClick={copyy} mode={mode} />
        <button
          className="btn btn-sm btn-warning  mx-1 my-1"
          type="button"
          onClick={handleUndo}
          mode={mode}
        >
          Undo
        </button>
        <button
          className="btn btn-sm btn-warning  mx-1 my-1"
          type="button"
          onClick={handleRedo}
          mode={mode}
        >
          Redo
        </button>
        <button
          className="btn btn-sm btn-danger  mx-1 my-1"
          type="button"
          onClick={() => {
            clearr();
            setFindValue(""); // Clear the "Find" input
            setReplaceValue(""); // Clear the "Replace" input
            setText(""); // Clear the main text area
          }}
          mode={mode}
        >
          Clear
        </button>

        <div className="btn-group mx-1 my-1">
          <button
            className="btn btn-sm btn-success dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Download
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
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleDownloadAs("qr")}
              >
                QR Code
              </button>
            </li>
          </ul>
        </div>

        <div className="btn-group mx-1 my-1">
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

        {qrText && text.trim() && (
          <div className="qr-container mt-4" ref={qrRef}>
            <h4>Generated QR Code:</h4>
            <QRCodeCanvas value={text} size={200} />
          </div>
        )}

        {/* {qrText && (
          <div className="qr-container mt-4 " ref={qrRef}>
            <h4>Generated QR Code:</h4>
            <QRCodeCanvas value={qrText} size={150} />
          </div>
        )} */}
      </div>

      <div
        className="container mt-4"
        style={{
          color: mode === "dark" ? "white" : "#042743",
        }}
      >
        <h4>Text Statistics</h4>
        <p>
          {wordCount} word(s), {letterCount} letter(s), {charCount}{" "}
          character(s), {sentenceCount} sentence(s) and {paragraphCount}{" "}
          paragraph(s)
        </p>
        <p>{0.008 * wordCount} Minute(s) read</p>
      </div>
    </>
  );
}
