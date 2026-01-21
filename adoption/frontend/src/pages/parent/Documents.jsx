import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { APPLICATION_STATUS, DOCUMENT_STATUS } from "../../utils/constants";

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

  const [status, setStatus] = useState(DOCUMENT_STATUS.PENDING);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load existing documents from localStorage
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const savedDocs = JSON.parse(localStorage.getItem(`documents_${authUser.username}`)) || {};
    
    // Check if user has an approved application
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const userApp = applications.find(app => app.parentUsername === authUser.username && app.status === APPLICATION_STATUS.DOCUMENTS_REQUESTED);
    
    if (!savedDocs.status && userApp) {
      // Initialize document status if application is approved
      setStatus(DOCUMENT_STATUS.PENDING);
    } else {
      setDocuments(prev => ({ ...prev, ...savedDocs }));
      setStatus(savedDocs.status || DOCUMENT_STATUS.PENDING);
    }
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
    const docData = {
      ...documents,
      status: DOCUMENT_STATUS.SUBMITTED,
      submittedAt: new Date().toISOString(),
      parentUsername: authUser.username
    };

    // Save to localStorage
    localStorage.setItem(`documents_${authUser.username}`, JSON.stringify(docData));
    
    // Update application status to DOCUMENTS_SUBMITTED
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const updatedApps = applications.map(app => {
      if (app.parentUsername === authUser.username && 
          (app.status === APPLICATION_STATUS.DOCUMENTS_REQUESTED || app.status === APPLICATION_STATUS.DOCUMENTS_SUBMITTED)) {
        return { ...app, status: APPLICATION_STATUS.DOCUMENTS_SUBMITTED };
      }
      return app;
    });
    localStorage.setItem("applications", JSON.stringify(updatedApps));
    
    // Add notification for staff
    const staffNotifications = JSON.parse(localStorage.getItem("staffNotifications")) || [];
    staffNotifications.push({
      id: Date.now(),
      message: `Documents submitted by ${authUser.username} - Ready for staff verification`,
      type: "info",
      read: false,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("staffNotifications", JSON.stringify(staffNotifications));

    setStatus(DOCUMENT_STATUS.SUBMITTED);
    setMessage("Documents submitted successfully! Staff will verify your documents first, then admin will do final approval.");
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

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3 className="text-center mb-4">📁 Document Submission</h3>

        {message && (
          <div className="alert alert-success text-center">
            {message}
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Required Documents for Adoption</h5>
                <small>Status: <span className={`badge ${
                  status === DOCUMENT_STATUS.ADMIN_APPROVED ? 'bg-success' : 
                  status === DOCUMENT_STATUS.STAFF_VERIFIED ? 'bg-info' :
                  status === DOCUMENT_STATUS.SUBMITTED ? 'bg-warning' : 'bg-secondary'
                }`}>
                  {status === DOCUMENT_STATUS.ADMIN_APPROVED ? 'Admin Approved' :
                   status === DOCUMENT_STATUS.STAFF_VERIFIED ? 'Staff Verified' :
                   status === DOCUMENT_STATUS.SUBMITTED ? 'Under Staff Review' : 'Pending'}
                </span></small>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {documentTypes.map((docType) => (
                    <div key={docType.key} className="mb-4">
                      <label className="form-label fw-bold">
                        {docType.label}
                        {docType.required && <span className="text-danger">*</span>}
                      </label>
                      <div className="input-group">
                        <input
                          type="file"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(docType.key, e.target.files[0])}
                          disabled={status === DOCUMENT_STATUS.SUBMITTED || status === DOCUMENT_STATUS.STAFF_VERIFIED || status === DOCUMENT_STATUS.ADMIN_APPROVED}
                        />
                        {documents[docType.key] && (
                          <span className="input-group-text bg-success text-white">
                            <i className="fas fa-check"></i>
                          </span>
                        )}
                      </div>
                      {documents[docType.key] && (
                        <small className="text-success">
                          Selected: {documents[docType.key]}
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

                  {status === DOCUMENT_STATUS.PENDING && (
                    <div className="text-center">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={!Object.values(documents).every(doc => doc !== null)}
                      >
                        Submit All Documents
                      </button>
                    </div>
                  )}

                  {status === DOCUMENT_STATUS.SUBMITTED && (
                    <div className="alert alert-warning text-center">
                      <i className="fas fa-clock me-2"></i>
                      Documents submitted and under staff verification
                    </div>
                  )}

                  {status === DOCUMENT_STATUS.STAFF_VERIFIED && (
                    <div className="alert alert-info text-center">
                      <i className="fas fa-check me-2"></i>
                      Documents verified by staff - Pending admin approval
                    </div>
                  )}



                  {status === DOCUMENT_STATUS.ADMIN_APPROVED && (
                    <div className="alert alert-success text-center">
                      <i className="fas fa-check-circle me-2"></i>
                      Documents approved! You can proceed with adoption applications.
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