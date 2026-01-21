import React, { useEffect, useState } from "react";
import { APPLICATION_STATUS, DOCUMENT_STATUS, CHILD_STATUS } from "../../utils/constants";

const AdoptionRequests = () => {
  const [applications, setApplications] = useState([]);
  const [children, setChildren] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    console.log("All applications:", apps);
    const staffVerifiedApps = apps.filter(app => app.status === APPLICATION_STATUS.PENDING_ADMIN_APPROVAL);
    console.log("Staff verified apps:", staffVerifiedApps);
    setApplications(staffVerifiedApps);
    setChildren(JSON.parse(localStorage.getItem("childrenData")) || []);
    
    // Load documents for staff-verified applications
    const docs = [];
    staffVerifiedApps.forEach(app => {
      const userDocs = JSON.parse(localStorage.getItem(`documents_${app.parentUsername}`));
      console.log(`Documents for ${app.parentUsername}:`, userDocs);
      if (userDocs && userDocs.status === DOCUMENT_STATUS.STAFF_VERIFIED) {
        docs.push({ ...userDocs, applicationId: app.id, childName: app.childName });
      }
    });
    console.log("Final documents for admin:", docs);
    setDocuments(docs);
  };

  const getUserName = (username) => username;

  const handleApproveApplication = (appId, parentUsername) => {
    // Update application status
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const updatedApps = apps.map(app => {
      if (app.id === appId) {
        return { ...app, status: APPLICATION_STATUS.APPROVED, adminApprovedAt: new Date().toISOString() };
      }
      return app;
    });
    localStorage.setItem("applications", JSON.stringify(updatedApps));
    
    // Update document status
    const docData = JSON.parse(localStorage.getItem(`documents_${parentUsername}`));
    if (docData) {
      docData.status = DOCUMENT_STATUS.ADMIN_APPROVED;
      docData.adminApprovedAt = new Date().toISOString();
      localStorage.setItem(`documents_${parentUsername}`, JSON.stringify(docData));
    }
    
    // Update child status to ADOPTED
    const app = apps.find(a => a.id === appId);
    const childrenData = JSON.parse(localStorage.getItem("childrenData")) || [];
    const updatedChildren = childrenData.map(c => 
      c.id === app.childId ? { ...c, status: CHILD_STATUS.ADOPTED } : c
    );
    localStorage.setItem("childrenData", JSON.stringify(updatedChildren));
    
    // Notify parent
    const parentNotifications = JSON.parse(localStorage.getItem("parentNotifications")) || [];
    parentNotifications.push({
      id: Date.now(),
      message: `Congratulations! Your adoption application for ${app.childName} has been approved. Our team will contact you for the next steps.`,
      type: "success",
      read: false,
      parentUsername: parentUsername,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("parentNotifications", JSON.stringify(parentNotifications));
    
    loadData();
    alert("Application approved! Parent has been notified.");
  };

  const handleRejectApplication = (appId, parentUsername) => {
    // Update application status
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const app = apps.find(a => a.id === appId);
    const updatedApps = apps.map(app => {
      if (app.id === appId) {
        return { ...app, status: APPLICATION_STATUS.REJECTED, adminRejectedAt: new Date().toISOString() };
      }
      return app;
    });
    localStorage.setItem("applications", JSON.stringify(updatedApps));
    
    // Update child status back to AVAILABLE
    const childrenData = JSON.parse(localStorage.getItem("childrenData")) || [];
    const updatedChildren = childrenData.map(c => 
      c.id === app.childId ? { ...c, status: CHILD_STATUS.AVAILABLE } : c
    );
    localStorage.setItem("childrenData", JSON.stringify(updatedChildren));
    
    // Notify parent
    const parentNotifications = JSON.parse(localStorage.getItem("parentNotifications")) || [];
    parentNotifications.push({
      id: Date.now(),
      message: `Your adoption application for ${app.childName} has been rejected after final review. Please contact us for more information.`,
      type: "error",
      read: false,
      parentUsername: parentUsername,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("parentNotifications", JSON.stringify(parentNotifications));
    
    loadData();
    alert("Application rejected! Parent has been notified.");
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-clipboard-check fa-2x text-primary me-3"></i>
            <div>
              <h1 className="mb-1">Final Adoption Approval</h1>
              <p className="text-muted mb-0">Applications that have been verified by staff and are ready for final admin approval.</p>
            </div>
          </div>
        </div>
      </div>
      
      {applications.length === 0 && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info text-center py-5">
              <i className="fas fa-info-circle fa-3x text-info mb-3"></i>
              <h5>No applications pending admin approval</h5>
              <p>All applications are either still under staff review or have been processed.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="row">
        {applications.map(app => {
          const doc = documents.find(d => d.applicationId === app.id);
          return (
            <div key={app.id} className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                  <div className="d-flex align-items-center text-white">
                    <i className="fas fa-user-friends fa-lg me-3"></i>
                    <div>
                      <h5 className="mb-0">Application #{app.id}</h5>
                      <small className="opacity-75">Parent: {getUserName(app.parentUsername)} | Child: {app.childName}</small>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <span className="badge bg-warning fs-6 px-3 py-2">
                      <i className="fas fa-clock me-1"></i>
                      Pending Final Approval
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Application Details
                    </h6>
                    <div className="row text-sm">
                      <div className="col-6">
                        <p className="mb-2">
                          <i className="fas fa-calendar-alt text-muted me-2"></i>
                          <strong>Submitted:</strong><br/>
                          <span className="text-muted">{new Date(app.submittedAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <strong>Staff Approved:</strong> ✅
                        </p>
                        <p className="mb-2">
                          <i className="fas fa-file-check text-success me-2"></i>
                          <strong>Documents Verified:</strong> ✅
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {doc && (
                    <div className="mb-4">
                      <h6 className="text-success mb-3">
                        <i className="fas fa-shield-alt me-2"></i>
                        Document Status
                      </h6>
                      <div className="alert alert-success border-0" style={{backgroundColor: '#d1f2eb'}}>
                        <i className="fas fa-check-double text-success me-2"></i>
                        <small className="text-success fw-bold">All documents verified by staff</small>
                      </div>
                    </div>
                  )}
                  
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success flex-fill py-2"
                      onClick={() => handleApproveApplication(app.id, app.parentUsername)}
                    >
                      <i className="fas fa-thumbs-up me-2"></i>
                      Final Approval
                    </button>
                    <button
                      className="btn btn-danger flex-fill py-2"
                      onClick={() => handleRejectApplication(app.id, app.parentUsername)}
                    >
                      <i className="fas fa-times me-2"></i>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdoptionRequests;