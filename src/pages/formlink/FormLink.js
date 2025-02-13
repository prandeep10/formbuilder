import React, { useEffect, useState } from "react";
import "./FormLinks.css";

const FormLinks = () => {
  const [forms, setForms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("https://formbuilder.webartstudios.in/list_forms.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.forms)) {
          setForms(data.forms);
        } else {
          setErrorMessage("Failed to fetch forms.");
        }
      })
      .catch((error) => {
        setErrorMessage("An error occurred while fetching forms.");
        console.error("Fetch error:", error);
      });
  }, []);

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy the link."));
  };

  return (
    <div className="form-links-container">
      <h1 className="form-links-title">Form Links</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul className="form-links-list">
        {forms.map((form) => {
          const formLink = `https://formbuilder-aec.webartstudios.in/form?form_id=${form.form_id}`;
          return (
            <li key={form.form_id} className="form-link-item">
              <div className="form-link-details">
                <p className="form-title">{form.form_title}</p>
                <p className="form-description">{form.form_description}</p>
              </div>
              <div className="form-link-actions">
                <a href={formLink} target="_blank" rel="noopener noreferrer" className="view-link">
                  View
                </a>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(formLink)}
                >
                  Copy Link
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FormLinks;