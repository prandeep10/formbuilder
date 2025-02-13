import React, { useState } from "react";
import "./CreateForm.css";

const CreateForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Debugging: Log form fields whenever they change
  React.useEffect(() => {
    console.log("Form fields updated:", formFields);
  }, [formFields]);

  const addField = () => {
    console.log("Adding new field");
    setFormFields([
      ...formFields,
      { field_label: "", field_type: "text", is_required: false, field_options: [] },
    ]);
  };

  const removeField = (index) => {
    console.log(`Removing field at index ${index}`);
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const handleFieldChange = (index, key, value) => {
    console.log(`Updating field at index ${index}:`, key, value);
    const updatedFields = [...formFields];
    updatedFields[index][key] = value;
    setFormFields(updatedFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      form_title: formTitle,
      form_description: formDescription,
      form_fields: formFields,
    };

    // Debugging: Log the form data to ensure it is correctly structured
    console.log("Submitting form data:", formData);

    fetch("https://formbuilder.webartstudios.in/create_form.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from API:", data); // Debugging API response
        if (data.success) {
          setSuccessMessage(data.message);
          setFormTitle("");
          setFormDescription("");
          setFormFields([]);
        } else {
          setErrorMessage("Failed to create the form.");
        }
      })
      .catch((error) => {
        console.error("Error occurred while creating form:", error); // Debugging errors
        setErrorMessage("An error occurred while creating the form.");
      });
  };

  return (
    <div className="create-form-container">
      <h1>Create Form</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Form Title</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Form Description</label>
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-fields">
          <h3>Form Fields</h3>
          {formFields.map((field, index) => (
            <div key={index} className="field-group">
              <input
                type="text"
                placeholder="Field Label"
                value={field.field_label}
                onChange={(e) =>
                  handleFieldChange(index, "field_label", e.target.value)
                }
                required
              />
              <select
                value={field.field_type}
                onChange={(e) =>
                  handleFieldChange(index, "field_type", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="radio">Radio</option>
                <option value="textarea">Textarea</option>
              </select>
              <label>
                Required
                <input
                  type="checkbox"
                  checked={field.is_required}
                  onChange={(e) =>
                    handleFieldChange(index, "is_required", e.target.checked)
                  }
                />
              </label>
              {field.field_type === "radio" && (
                <textarea
                  placeholder="Options (comma-separated)"
                  value={field.field_options.join(", ")}
                  onChange={(e) =>
                    handleFieldChange(
                      index,
                      "field_options",
                      e.target.value.split(",").map((opt) => opt.trim())
                    )
                  }
                ></textarea>
              )}
              <button
                type="button"
                className="remove-field-button"
                onClick={() => removeField(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-field-button" onClick={addField}>
            + Add Field
          </button>
        </div>
        <button type="submit" className="submit-button">
          Create Form
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
