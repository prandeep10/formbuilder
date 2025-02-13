import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Form.css";

const FormView = () => {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("form_id");
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false); // Debugging toggle state

  useEffect(() => {
    if (formId) {
      fetch(`https://formbuilder.webartstudios.in/get_form.php?form_id=${formId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.form?.form_fields) {
            const formFields = JSON.parse(data.form.form_fields);
            if (formFields && Array.isArray(formFields)) {
              setFormData(data.form);
              initializeFormValues(formFields);
            } else {
              setErrorMessage("Invalid form fields format.");
              console.error("form_fields is not a valid array:", formFields);
            }
          } else {
            setErrorMessage("Failed to fetch form details or missing form fields.");
            console.error("API response error:", data);
          }
        })
        .catch((error) => {
          setErrorMessage("An error occurred while fetching form data.");
          console.error("Fetch error:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setErrorMessage("Form ID is missing. Please provide a valid form_id in the URL.");
      setLoading(false);
    }
  }, [formId]);

  const initializeFormValues = (fields) => {
    if (!fields) {
      setErrorMessage("Form fields are missing from the response.");
      return;
    }

    const values = {};
    fields.forEach((field) => {
      values[field.field_label] = field.field_type === "checkbox" ? false : "";
    });
    setFormValues(values);
  };

  const handleInputChange = (label, value) => {
    setFormValues({ ...formValues, [label]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://formbuilder.webartstudios.in/FormSubmit.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        form_id: formId,
        form_data: formValues,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage(data.message);
          setFormValues({});
        } else {
          setErrorMessage("Failed to submit the form. Check the API response.");
          console.error("Submit API response error:", data);
        }
      })
      .catch((error) => {
        setErrorMessage("An error occurred while submitting the form.");
        console.error("Submit fetch error:", error);
      });
  };

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  return (
    <div className="form-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {formData && (
        <>
          <h1 className="form-title">{formData.form_title}</h1>
          <p className="form-description">{formData.form_description}</p>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="feedback-form">
            {JSON.parse(formData.form_fields).map((field, index) => (
              <div key={index} className="form-group">
                <label htmlFor={`field-${index}`}>{field.field_label}</label>
                {field.field_type === "text" || field.field_type === "email" ? (
                  <input
                    id={`field-${index}`}
                    type={field.field_type}
                    value={formValues[field.field_label] || ""}
                    onChange={(e) => handleInputChange(field.field_label, e.target.value)}
                    required={field.is_required}
                  />
                ) : field.field_type === "textarea" ? (
                  <textarea
                    id={`field-${index}`}
                    value={formValues[field.field_label] || ""}
                    onChange={(e) => handleInputChange(field.field_label, e.target.value)}
                    required={field.is_required}
                  ></textarea>
                ) : field.field_type === "radio" ? (
                  field.field_options.map((option, optIndex) => (
                    <div key={optIndex} className="radio-group">
                      <input
                        type="radio"
                        id={`option-${index}-${optIndex}`}
                        name={field.field_label}
                        value={option}
                        checked={formValues[field.field_label] === option}
                        onChange={() => handleInputChange(field.field_label, option)}
                        required={field.is_required}
                      />
                      <label htmlFor={`option-${index}-${optIndex}`}>{option}</label>
                    </div>
                  ))
                ) : (
                  <p className="unsupported-field">Unsupported field type: {field.field_type}</p>
                )}
              </div>
            ))}
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </>
      )}


      {debugMode && (
        <div className="debug-container">
          <h2>Debugging Information</h2>
          <pre>Form ID: {formId}</pre>
          <pre>Form Data: {JSON.stringify(formData, null, 2)}</pre>
          <pre>Form Values: {JSON.stringify(formValues, null, 2)}</pre>
          <pre>Error Message: {errorMessage}</pre>
          <pre>Success Message: {successMessage}</pre>
        </div>
      )}
    </div>
  );
};

export default FormView;
