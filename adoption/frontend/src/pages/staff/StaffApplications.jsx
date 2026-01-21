import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { APPLICATION_STATUS, DOCUMENT_STATUS } from "../../utils/constants";

function StaffApplications() {
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("applications");

  useEffect(() => {
    loadApplications();
    loadDocuments();
  }, []);

  const loadApplications = () => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(apps);
  };

  const loadDocuments = () => {
    const docs = [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.forEach(user => {
      const userDocs = JSON.parse(localStorage.getItem(`documents_${user.username}`));
      if (userDocs && userDocs.status === DOCUMENT_STATUS.SUBMITTED) {
        docs.push(userDocs);
      }
    });
    setDocuments(docs);
  };

  const handleApproveApplication = (appId) => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const updatedApps = apps.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: APPLICATION_STATUS.DOCUMENTS_REQUESTED,
          staffMessage: "Your application has been approved! Please submit the required documents to proceed with the adoption process."
        };
      }
      return app;
    });

    localStorage.setItem("applications", JSON.stringify(updatedApps));
    
    // Add notification for parent
    const parentNotifications = JSON.parse(localStorage.getItem("parentNotifications")) || [];
    const app = apps.find(a => a.id === appId);
    parentNotifications.push({
      id: Date.now(),
      message: `Your adoption application for ${app.childName} has been approved. Please submit required documents.`,
      type: "success",
      read: false,
      parentUsername: app.parentUsername,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("parentNotifications", JSON.stringify(parentNotifications));

    loadApplications();
    alert("Application approved and parent notified to submit documents!");
  };

  const handleRejectApplication = (appId) => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const app = apps.find(a => a.id === appId);
    
    const updatedApps = apps.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: APPLICATION_STATUS.REJECTED,
          staffMessage: message || "Your application has been rejected. Please contact us for more information."
        };
      }
      return app;
    });

    // Update child status back to AVAILABLE
    const childrenData = JSON.parse(localStorage.getItem("childrenData")) || [];
    const updatedChildren = childrenData.map(c => 
      c.id === app.childId ? { ...c, status: "AVAILABLE" } : c
    );
    localStorage.setItem("childrenData", JSON.stringify(updatedChildren));

    localStorage.setItem("applications", JSON.stringify(updatedApps));
    loadApplications();
    setMessage("");
    setSelectedApp(null);
    alert("Application rejected and parent notified!");
  };

  const handleVerifyDocuments = (parentUsername) => {
    const docData = JSON.parse(localStorage.getItem(`documents_${parentUsername}`));
    if (docData) {
      docData.status = DOCUMENT_STATUS.STAFF_VERIFIED;
      docData.staffVerifiedAt = new Date().toISOString();
      localStorage.setItem(`documents_${parentUsername}`, JSON.stringify(docData));
      
      // Update application status
      const apps = JSON.parse(localStorage.getItem("applications")) || [];
      const updatedApps = apps.map(app => {
        if (app.parentUsername === parentUsername && app.status === APPLICATION_STATUS.DOCUMENTS_SUBMITTED) {
          return { ...app, status: APPLICATION_STATUS.PENDING_ADMIN_APPROVAL };
        }
        return app;
      });
      localStorage.setItem("applications", JSON.stringify(updatedApps));
      
      // Notify admin
      const adminNotifications = JSON.parse(localStorage.getItem("adminNotifications")) || [];
      adminNotifications.push({
        id: Date.now(),
        message: `Documents verified by staff for ${parentUsername} - Ready for admin approval`,
        type: "info",
        read: false,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("adminNotifications", JSON.stringify(adminNotifications));
      
      loadDocuments();
      loadApplications();
      alert("Documents verified and sent to admin for final approval!");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [APPLICATION_STATUS.PENDING_STAFF_APPROVAL]: { class: "bg-warning", text: "Pending Review" },
      [APPLICATION_STATUS.DOCUMENTS_REQUESTED]: { class: "bg-info", text: "Documents Requested" },
      [APPLICATION_STATUS.DOCUMENTS_SUBMITTED]: { class: "bg-primary", text: "Documents Submitted" },
      [APPLICATION_STATUS.STAFF_VERIFIED]: { class: "bg-info", text: "Staff Verified" },
      [APPLICATION_STATUS.PENDING_ADMIN_APPROVAL]: { class: "bg-warning", text: "Pending Admin" },
      [APPLICATION_STATUS.APPROVED]: { class: "bg-success", text: "Approved" },
      [APPLICATION_STATUS.REJECTED]: { class: "bg-danger", text: "Rejected" }
    };
    return statusConfig[status] || { class: "bg-secondary", text: status };
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex align-items-center mb-4">
          <i className="fas fa-users-cog fa-2x text-primary me-3"></i>
          <h3 className="mb-0">Staff Dashboard</h3>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-pills mb-4 justify-content-center">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'applications' ? 'active' : ''} px-4 py-2`}
              onClick={() => setActiveTab('applications')}
            >
              <i className="fas fa-clipboard-list me-2"></i>
              Application Review
            </button>
          </li>
          <li className="nav-item ms-2">
            <button 
              className={`nav-link ${activeTab === 'documents' ? 'active' : ''} px-4 py-2 position-relative`}
              onClick={() => setActiveTab('documents')}
            >
              <i className="fas fa-file-check me-2"></i>
              Document Verification
              {documents.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {documents.length}
                </span>
              )}
            </button>
          </li>
        </ul>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="row">
            {applications.map((app) => {
              const statusInfo = getStatusBadge(app.status);
              return (
                <div key={app.id} className="col-lg-6 mb-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header" style={{background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'}}>
                      <div className="d-flex align-items-center text-white">
                        <i className="fas fa-file-alt fa-lg me-3"></i>
                        <div>
                          <h5 className="mb-0">Application #{app.id}</h5>
                          <small className="opacity-75">
                            Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-6">
                            <p className="mb-1">
                              <i className="fas fa-user text-primary me-2"></i>
                              <strong>Parent:</strong>
                            </p>
                            <p className="text-muted">{app.parentName}</p>
                          </div>
                          <div className="col-6">
                            <p className="mb-1">
                              <i className="fas fa-child text-success me-2"></i>
                              <strong>Child:</strong>
                            </p>
                            <p className="text-muted">{app.childName}</p>
                          </div>
                        </div>
                        <span className={`badge ${statusInfo.class} fs-6 px-3 py-2 mt-2`}>
                          <i className="fas fa-info-circle me-1"></i>
                          {statusInfo.text}
                        </span>
                      </div>

                      {app.staffMessage && (
                        <div className="alert alert-info">
                          <strong>Staff Message:</strong> {app.staffMessage}
                        </div>
                      )}

                      {app.status === APPLICATION_STATUS.PENDING_STAFF_APPROVAL && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm flex-fill py-2"
                            onClick={() => handleApproveApplication(app.id)}
                          >
                            <i className="fas fa-check me-2"></i>
                            Approve & Request Documents
                          </button>
                          <button
                            className="btn btn-danger btn-sm flex-fill py-2"
                            onClick={() => setSelectedApp(app.id)}
                          >
                            <i className="fas fa-times me-2"></i>
                            Reject
                          </button>
                        </div>
                      )}

                      {selectedApp === app.id && (
                        <div className="mt-3">
                          <textarea
                            className="form-control mb-2"
                            placeholder="Reason for rejection..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() => handleRejectApplication(app.id)}
                          >
                            Confirm Rejection
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setSelectedApp(null);
                              setMessage("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {applications.length === 0 && (
              <div className="text-center">
                <div className="alert alert-info">
                  <h5>No applications to review</h5>
                  <p>All applications have been processed.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="row">
            {documents.map((doc) => (
              <div key={doc.parentUsername} className="col-lg-6 mb-4">
                <div className="card shadow">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Documents - {doc.parentUsername}</h5>
                    <small className="text-muted">
                      Submitted: {new Date(doc.submittedAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <span className="badge bg-warning">Pending Staff Verification</span>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Submitted Documents:</h6>
                      <ul className="list-unstyled">
                        {Object.entries(doc).map(([key, value]) => {
                          if (key.includes('Proof') || key.includes('Certificate') || key.includes('Verification') || key.includes('Clearance') || key === 'photographs') {
                            return (
                              <li key={key} className="mb-1">
                                <i className={`fas ${value ? 'fa-check text-success' : 'fa-times text-danger'} me-2`}></i>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </div>

                    <div className="text-center">
                      <button
                        className="btn btn-success"
                        onClick={() => handleVerifyDocuments(doc.parentUsername)}
                      >
                        Verify Documents & Send to Admin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="text-center">
                <div className="alert alert-info">
                  <h5>No documents to verify</h5>
                  <p>All submitted documents have been verified.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StaffApplications;