import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch forms from the API
  useEffect(() => {
    fetch("https://formbuilder.webartstudios.in/list_forms.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch forms.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setForms(data.forms);
        } else {
          setForms([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Redirect to the Add Form page
  const handleAddForm = () => {
    window.location.href = "/add-form"; // Use window.location.href for navigation
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>Form Builder</h1>
        <button className="add-form-button" onClick={handleAddForm}>
          + Add Form
        </button>
      </div>
      {loading ? (
        <p>Loading forms...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : forms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        <div className="form-list">
          {forms.map((form) => (
            <div key={form.form_id} className="form-card">
              <h3>{form.form_title}</h3>
              <p>{form.form_description}</p>
              <small>Created: {new Date(form.created_at).toLocaleString()}</small>
              <div className="form-fields">
                <h4>Fields:</h4>
                {form.form_fields ? (
                  <ul>
                    {JSON.parse(form.form_fields).map((field, index) => (
                      <li key={index}>
                        <strong>Label:</strong> {field.field_label} <br />
                        <strong>Type:</strong> {field.field_type} <br />
                        <strong>Required:</strong> {field.is_required ? "Yes" : "No"}
                        {field.field_options && (
                          <div>
                            <strong>Options:</strong>{" "}
                            {field.field_options.join(", ")}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No fields available for this form.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
