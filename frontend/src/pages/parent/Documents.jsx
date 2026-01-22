import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";

function Documents() {
  const [documents, setDocuments] = useState({
    identityProof: null,
    addressProof: null,
    ageProof: null,
    incomeProof: null,
    marriageProof: null,
    medicalCertificate: null,
    policeVerification: null,
    policeClearance: null,
    photographs: null
  });

  const [status, setStatus] = useState("PENDING");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (!authUser) return;

    const savedDocs =
      JSON.parse(localStorage.getItem(`documents_${authUser.username}`)) || {};

    setDocuments(prev => ({
      ...prev,
      ...savedDocs
    }));

    setStatus(savedDocs.status || "PENDING");
  }, []);

  const handleFileChange = (docType, file) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: file ? file.name : null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (!authUser) return;

    const docData = {
      ...documents,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
      parentUsername: authUser.username
    };

    localStorage.setItem(
      `documents_${authUser.username}`,
      JSON.stringify(docData)
    );

    const notifications =
      JSON.parse(localStorage.getItem("adminNotifications")) || [];

    notifications.push({
      id: Date.now(),
      message: `Documents submitted by ${authUser.username}`,
      type: "info",
      read: false,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem(
      "adminNotifications",
      JSON.stringify(notifications)
    );

    setStatus("SUBMITTED");
    setMessage("Documents submitted successfully! Admin will review them.");

    // ✅ AUTO REFRESH PAGE AFTER SUBMIT
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleEditResubmit = () => {
    setStatus("PENDING");
    setMessage("You can now edit and resubmit your documents.");
  };

  const documentTypes = [
    { key: "identityProof", label: "Identity Proof", required: true },
    { key: "addressProof", label: "Address Proof", required: true },
    { key: "ageProof", label: "Age Proof", required: true },
    { key: "incomeProof", label: "Income & Financial Proof", required: true },
    { key: "marriageProof", label: "Marriage / Relationship Proof", required: true },
    { key: "medicalCertificate", label: "Medical Fitness Certificate", required: true },
    { key: "policeVerification", label: "Police Verification / Character Certificate", required: true },
    { key: "policeClearance", label: "Police Clearance Certificate (PCC)", required: true },
    { key: "photographs", label: "Photographs", required: true }
  ];

  const allDocsUploaded = Object.values(documents).every(doc => doc !== null);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3 className="text-center mb-4">📁 Document Submission</h3>

        {message && (
          <div className="alert alert-info text-center">
            {message}
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Required Documents for Adoption</h5>
                <small>
                  Status:{" "}
                  <span
                    className={`badge ${
                      status === "APPROVED"
                        ? "bg-success"
                        : status === "SUBMITTED"
                        ? "bg-warning"
                        : "bg-secondary"
                    }`}
                  >
                    {status}
                  </span>
                </small>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {documentTypes.map(doc => (
                    <div key={doc.key} className="mb-4">
                      <label className="form-label fw-bold">
                        {doc.label}
                        {doc.required && (
                          <span className="text-danger">*</span>
                        )}
                      </label>

                      <div className="input-group">
                        <input
                          type="file"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg,.png"
                          disabled={status !== "PENDING"}
                          onChange={(e) =>
                            handleFileChange(doc.key, e.target.files[0])
                          }
                        />

                        {documents[doc.key] && (
                          <span className="input-group-text bg-success text-white">
                            ✓
                          </span>
                        )}
                      </div>

                      {documents[doc.key] && (
                        <small className="text-success">
                          Uploaded: {documents[doc.key]}
                        </small>
                      )}
                    </div>
                  ))}

                  <div className="alert alert-info">
                    <h6>📋 Document Guidelines:</h6>
                    <ul className="mb-0">
                      <li>All documents must be clear and legible</li>
                      <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
                      <li>Maximum file size: 5MB per document</li>
                      <li>Documents should be recent (within 6 months)</li>
                    </ul>
                  </div>

                  {status === "PENDING" && (
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={!allDocsUploaded}
                      >
                        Submit All Documents
                      </button>
                    </div>
                  )}

                  {status === "SUBMITTED" && (
                    <>
                      <div className="alert alert-warning text-center">
                        ⏳ Documents submitted and under admin review
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={handleEditResubmit}
                        >
                          Edit & Resubmit Documents
                        </button>
                      </div>
                    </>
                  )}

                  {status === "APPROVED" && (
                    <div className="alert alert-success text-center">
                      ✅ Documents approved! You may proceed with adoption.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Documents;
