import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import documentService from "../../services/documentService";
import applicationService from "../../services/applicationService";
import { showSuccessToast, showErrorToast } from "../../utils/errorHandler";

function DocumentReview() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState({ name: "", url: "", type: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicationsWithDocuments();
  }, []);

  const loadApplicationsWithDocuments = async () => {
    try {
      setLoading(true);
      
      // Try backend first
      try {
        const apps = await applicationService.getAllApplications();
        const docsSubmitted = apps.filter(app => 
          app.status === "DOCUMENTS_SUBMITTED" || app.status === "DOCUMENTS_VERIFIED"
        );
        if (docsSubmitted.length > 0) {
          setApplications(docsSubmitted);
          return;
        }
      } catch (backendError) {
        console.log('Backend fetch failed, using localStorage:', backendError);
      }
      
      // Fallback to localStorage
      const apps = JSON.parse(localStorage.getItem("applications")) || [];
      const docsSubmitted = apps.filter(app => 
        app.status === "DOCUMENTS_SUBMITTED" || app.status === "DOCUMENTS_VERIFIED"
      );
      setApplications(docsSubmitted);
    } catch (error) {
      console.error('Error loading applications:', error);
      showErrorToast(error, "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const viewDocuments = async (app) => {
    try {
      setSelectedApp(app);
      
      // Try to fetch from backend first
      try {
        const appDocs = await documentService.getDocumentByApplication(app.id);
        console.log('Documents received from backend:', appDocs);
        if (appDocs) {
          setDocuments(appDocs);
          return;
        }
      } catch (backendError) {
        console.log('Backend fetch failed, trying localStorage:', backendError);
      }
      
      // Fallback to localStorage if backend fails
      const allDocs = JSON.parse(localStorage.getItem("documents")) || [];
      const appDocs = allDocs.find(doc => doc.applicationId === app.id);
      console.log('Documents from localStorage:', appDocs);
      if (appDocs) {
        setDocuments(appDocs);
      } else {
        showErrorToast(null, "No documents found for this application");
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      showErrorToast(error, "Failed to load documents");
    }
  };

  const openDocument = (docName, docUrl, docType) => {
    if (docUrl) {
      setCurrentDoc({ name: docName, url: docUrl, type: docType });
      setShowModal(true);
    } else {
      showErrorToast(null, "Document not available");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentDoc({ name: "", url: "", type: "" });
  };

  const finalizeVerification = async () => {
    if (!documents || !documents.id) {
      showErrorToast(null, "No documents to verify");
      return;
    }

    try {
      await documentService.verifyDocuments(documents.id, "VERIFIED", "All documents verified successfully");
      showSuccessToast("All documents verified! Application moved to next stage.");
      setSelectedApp(null);
      setDocuments(null);
      loadApplicationsWithDocuments();
    } catch (error) {
      console.error('Verification error:', error);
      showErrorToast(error, "Failed to verify documents. Please try again.");
    }
  };

  const rejectDocuments = async () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason || !reason.trim()) return;

    if (!documents || !documents.id) {
      showErrorToast(null, "No documents to reject");
      return;
    }

    try {
      await documentService.verifyDocuments(documents.id, "REJECTED", reason);
      showSuccessToast("Documents rejected. Parent has been notified.");
      setSelectedApp(null);
      setDocuments(null);
      loadApplicationsWithDocuments();
    } catch (error) {
      console.error('Rejection error:', error);
      showErrorToast(error, "Failed to reject documents. Please try again.");
    }
  };

  const documentTypes = [
    { key: "identityProof", label: "Identity Proof*" },
    { key: "ageProof", label: "Age Proof*" },
    { key: "incomeProof", label: "Income & Financial Proof*" },
    { key: "marriageProof", label: "Marriage / Relationship Proof" },
    { key: "medicalCertificate", label: "Medical Fitness Certificate" },
    { key: "policeClearance", label: "Police Clearance Certificate (PCC)" },
    { key: "photographs", label: "Photographs" }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center p-5">
          <div className="spinner-border"></div>
        </div>
      </>
    );
  }

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
                      <div key={docType.key} className="col-md-6 mb-3">
                        <div className="border p-3 rounded">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{docType.label}</strong>
                            {documents[docType.key] ? (
                              (documents.status === 'VERIFIED' || documents.status === 'APPROVED') ? (
                                <span className="badge bg-success">✓ Verified</span>
                              ) : documents.status === 'REJECTED' ? (
                                <span className="badge bg-danger">✗ Rejected</span>
                              ) : (
                                <span className="badge bg-warning">⏳ Pending</span>
                              )
                            ) : (
                              <span className="badge bg-secondary">Not Submitted</span>
                            )}
                          </div>
                          <div className="d-flex gap-2">
                            {documents[docType.key] ? (
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={() => openDocument(docType.label, documents[docType.key], docType.key)}
                              >
                                Open Document
                              </button>
                            ) : (
                              <span className="text-muted small">No document uploaded</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-2 justify-content-center">
                    {(documents.status !== 'VERIFIED' && documents.status !== 'APPROVED') && (
                      <>
                        <button
                          className="btn btn-success btn-lg"
                          onClick={finalizeVerification}
                        >
                          ✓ Approve All Documents
                        </button>
                        <button
                          className="btn btn-danger btn-lg"
                          onClick={rejectDocuments}
                        >
                          ✗ Reject Documents
                        </button>
                      </>
                    )}
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
