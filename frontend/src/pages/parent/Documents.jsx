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

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (!authUser) return;

    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const myApps = apps.filter(app => 
      app.parentUsername === authUser.username && 
      (app.status === "DOCUMENTS_REQUESTED" || app.status === "DOCUMENTS_SUBMITTED")
    );
    setApplications(myApps);

    if (myApps.length > 0) {
      setSelectedAppId(myApps[0].id);
    }
  }, []);

  const handleFileChange = (docType, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => ({
          ...prev,
          [docType]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedAppId) {
      alert("Please select an application to submit documents for");
      return;
    }

    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (!authUser) return;

    const docData = {
      ...documents,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
      parentUsername: authUser.username,
      applicationId: selectedAppId
    };

    const allDocs = JSON.parse(localStorage.getItem("documents")) || [];
    const existingIndex = allDocs.findIndex(doc => doc.applicationId === selectedAppId);
    
    if (existingIndex >= 0) {
      allDocs[existingIndex] = docData;
    } else {
      allDocs.push(docData);
    }
    localStorage.setItem("documents", JSON.stringify(allDocs));

    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const updatedApps = apps.map(app => {
      if (app.id === selectedAppId) {
        return {
          ...app,
          status: "DOCUMENTS_SUBMITTED",
          staffMessage: "Documents submitted successfully. Staff will review them soon."
        };
      }
      return app;
    });
    localStorage.setItem("applications", JSON.stringify(updatedApps));

    setStatus("SUBMITTED");
    setMessage("Documents submitted successfully! Staff will review them.");

    setTimeout(() => {
      window.location.reload();
    }, 500);
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

        {applications.length === 0 ? (
          <div className="alert alert-warning text-center">
            <h5>No applications require documents at this time</h5>
            <p>Documents will be requested by staff after your application is reviewed.</p>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow mb-3">
                <div className="card-body">
                  <label className="form-label fw-bold">Select Application:</label>
                  <select 
                    className="form-select"
                    value={selectedAppId || ""}
                    onChange={(e) => setSelectedAppId(Number(e.target.value))}
                  >
                    {applications.map(app => (
                      <option key={app.id} value={app.id}>
                        Application #{app.id} - {app.childName} ({app.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Required Documents for Adoption</h5>
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
                            ✓ File uploaded
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

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={!allDocsUploaded}
                      >
                        Submit All Documents
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Documents;
