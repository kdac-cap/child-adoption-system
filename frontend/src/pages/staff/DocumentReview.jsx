import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";

function DocumentReview() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState({ name: "", url: "", type: "" });
  const [docStatuses, setDocStatuses] = useState({});

  useEffect(() => {
    loadApplicationsWithDocuments();
  }, []);

  const loadApplicationsWithDocuments = () => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const docsSubmitted = apps.filter(app => 
      app.status === "DOCUMENTS_SUBMITTED" || app.status === "DOCUMENTS_VERIFIED"
    );
    setApplications(docsSubmitted);
  };

  const viewDocuments = (app) => {
    setSelectedApp(app);
    const allDocs = JSON.parse(localStorage.getItem("documents")) || [];
    const appDocs = allDocs.find(doc => doc.applicationId === app.id);
    setDocuments(appDocs);
    
    // Initialize document statuses
    if (appDocs) {
      const statuses = {};
      Object.keys(appDocs).forEach(key => {
        if (appDocs[key] && key !== 'status' && key !== 'submittedAt' && key !== 'parentUsername' && key !== 'applicationId') {
          statuses[key] = appDocs[`${key}Status`] || 'pending';
        }
      });
      setDocStatuses(statuses);
    }
  };

  const openDocument = (docName, docUrl, docType) => {
    if (docUrl) {
      setCurrentDoc({ name: docName, url: docUrl, type: docType });
      setShowModal(true);
    } else {
      alert("Document not available");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentDoc({ name: "", url: "", type: "" });
  };

  const verifyDocument = (docType, approved) => {
    const newStatus = approved ? 'verified' : 'rejected';
    setDocStatuses(prev => ({
      ...prev,
      [docType]: newStatus
    }));

    // Update in localStorage
    const allDocs = JSON.parse(localStorage.getItem("documents")) || [];
    const updatedDocs = allDocs.map(doc => {
      if (doc.applicationId === selectedApp.id) {
        return {
          ...doc,
          [`${docType}Status`]: newStatus
        };
      }
      return doc;
    });
    localStorage.setItem("documents", JSON.stringify(updatedDocs));

    // If rejected, notify parent
    if (!approved) {
      const parentNotifications = JSON.parse(localStorage.getItem("parentNotifications")) || [];
      parentNotifications.push({
        id: Date.now(),
        message: `Document "${docType}" was rejected. Please resubmit for application #${selectedApp.id}`,
        type: "warning",
        read: false,
        parentUsername: selectedApp.parentUsername,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("parentNotifications", JSON.stringify(parentNotifications));
      alert(`Document rejected. Parent has been notified to resubmit.`);
    } else {
      alert(`Document verified successfully!`);
    }
  };

  const finalizeVerification = () => {
    const allVerified = Object.values(docStatuses).every(status => status === 'verified');
    
    if (!allVerified) {
      alert("Please verify all documents before finalizing.");
      return;
    }

    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const updatedApps = apps.map(app => {
      if (app.id === selectedApp.id) {
        return {
          ...app,
          status: "DOCUMENTS_VERIFIED",
          staffMessage: "All documents verified successfully. Welfare visit will be scheduled soon."
        };
      }
      return app;
    });
    localStorage.setItem("applications", JSON.stringify(updatedApps));

    const parentNotifications = JSON.parse(localStorage.getItem("parentNotifications")) || [];
    parentNotifications.push({
      id: Date.now(),
      message: `All documents verified for ${selectedApp.childName} adoption. Welfare visit will be scheduled soon.`,
      type: "success",
      read: false,
      parentUsername: selectedApp.parentUsername,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("parentNotifications", JSON.stringify(parentNotifications));

    alert("All documents verified! Application moved to next stage.");
    setSelectedApp(null);
    setDocuments(null);
    loadApplicationsWithDocuments();
  };

  const documentTypes = [
    { key: "identityProof", label: "Identity Proof" },
    { key: "addressProof", label: "Address Proof" },
    { key: "ageProof", label: "Age Proof" },
    { key: "incomeProof", label: "Income Proof" },
    { key: "marriageProof", label: "Marriage Proof" },
    { key: "medicalCertificate", label: "Medical Certificate" },
    { key: "policeVerification", label: "Police Verification" },
    { key: "photographs", label: "Photographs" }
  ];

  return (
    <>
      <Navbar />
      <div className="container parent-dashboard-container">
        <h3 className="text-center parent-dashboard-title">📄 Document Review</h3>

        {!selectedApp ? (
          <div className="row">
            {applications.map((app) => (
              <div key={app.id} className="col-lg-6 mb-4">
                <div className="card shadow">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Application #{app.id}</h5>
                    <small className="text-muted">
                      Parent: {app.parentName} | Child: {app.childName}
                    </small>
                  </div>
                  <div className="card-body">
                    <span className={`badge ${app.status === "DOCUMENTS_VERIFIED" ? "bg-success" : "bg-warning"} mb-3`}>
                      {app.status === "DOCUMENTS_VERIFIED" ? "Verified" : "Pending Review"}
                    </span>
                    <div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => viewDocuments(app)}
                      >
                        View Documents
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <h5>No documents to review</h5>
                  <p>All submitted documents have been processed.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Documents for Application #{selectedApp.id}</h5>
              <small>Parent: {selectedApp.parentName} | Child: {selectedApp.childName}</small>
            </div>
            <div className="card-body">
              {documents ? (
                <>
                  <div className="row mb-4">
                    {documentTypes.map(docType => (
                      documents[docType.key] && (
                        <div key={docType.key} className="col-md-6 mb-3">
                          <div className="border p-3 rounded">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong>{docType.label}</strong>
                              {docStatuses[docType.key] === 'verified' && (
                                <span className="badge bg-success">✓ Verified</span>
                              )}
                              {docStatuses[docType.key] === 'rejected' && (
                                <span className="badge bg-danger">✗ Rejected</span>
                              )}
                              {docStatuses[docType.key] === 'pending' && (
                                <span className="badge bg-warning">⏳ Pending</span>
                              )}
                            </div>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={() => openDocument(docType.label, documents[docType.key], docType.key)}
                              >
                                Open Document
                              </button>
                              {docStatuses[docType.key] !== 'verified' && (
                                <button 
                                  className="btn btn-sm btn-success" 
                                  onClick={() => verifyDocument(docType.key, true)}
                                >
                                  ✓ Verify
                                </button>
                              )}
                              {docStatuses[docType.key] !== 'rejected' && (
                                <button 
                                  className="btn btn-sm btn-danger" 
                                  onClick={() => verifyDocument(docType.key, false)}
                                >
                                  ✗ Reject
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-success btn-lg"
                      onClick={finalizeVerification}
                    >
                      Finalize Verification
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedApp(null);
                        setDocuments(null);
                      }}
                    >
                      Back
                    </button>
                  </div>
                </>
              ) : (
                <div className="alert alert-warning">
                  No documents found for this application.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{currentDoc.name}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body" style={{ maxHeight: '70vh', overflow: 'auto' }}>
                  {currentDoc.url && (
                    <div className="text-center">
                      {currentDoc.url.startsWith('data:application/pdf') ? (
                        <iframe
                          src={currentDoc.url}
                          style={{ width: '100%', height: '600px', border: 'none' }}
                          title={currentDoc.name}
                        />
                      ) : (
                        <img
                          src={currentDoc.url}
                          alt={currentDoc.name}
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-success" 
                    onClick={() => {
                      verifyDocument(currentDoc.type, true);
                      closeModal();
                    }}
                  >
                    ✓ Verify This Document
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => {
                      verifyDocument(currentDoc.type, false);
                      closeModal();
                    }}
                  >
                    ✗ Reject This Document
                  </button>
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DocumentReview;
