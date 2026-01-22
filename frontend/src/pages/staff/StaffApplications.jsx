import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";

function StaffApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(apps);
  };

  const handleApproveApplication = (appId) => {
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const updatedApps = apps.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: "DOCUMENTS_REQUESTED",
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
    const updatedApps = apps.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: "REJECTED",
          staffMessage: message || "Your application has been rejected. Please contact us for more information."
        };
      }
      return app;
    });

    localStorage.setItem("applications", JSON.stringify(updatedApps));
    loadApplications();
    setMessage("");
    setSelectedApp(null);
    alert("Application rejected and parent notified!");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "PENDING_STAFF_APPROVAL": { class: "bg-warning", text: "Pending Review" },
      "DOCUMENTS_REQUESTED": { class: "bg-info", text: "Documents Requested" },
      "DOCUMENTS_SUBMITTED": { class: "bg-primary", text: "Documents Submitted" },
      "APPROVED": { class: "bg-success", text: "Approved" },
      "REJECTED": { class: "bg-danger", text: "Rejected" }
    };
    return statusConfig[status] || { class: "bg-secondary", text: status };
  };

  return (
    <>
      <Navbar />
      <div className="container parent-dashboard-container">
        <h3 className="text-center parent-dashboard-title ">👥 Staff - Application Review</h3>

        <div className="row">
          {applications.map((app) => {
            const statusInfo = getStatusBadge(app.status);
            return (
              <div key={app.id} className="col-lg-6 mb-4">
                <div className="card shadow">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Application #{app.id}</h5>
                    <small className="text-muted">
                      Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>Parent:</strong> {app.parentName}<br/>
                      <strong>Child:</strong> {app.childName}<br/>
                      <span className={`badge ${statusInfo.class} mt-2`}>
                        {statusInfo.text}
                      </span>
                    </div>

                    {app.staffMessage && (
                      <div className="alert alert-info">
                        <strong>Staff Message:</strong> {app.staffMessage}
                      </div>
                    )}

                    {app.status === "PENDING_STAFF_APPROVAL" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApproveApplication(app.id)}
                        >
                          Approve & Request Documents
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setSelectedApp(app.id)}
                        >
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
        </div>

        {applications.length === 0 && (
          <div className="text-center">
            <div className="alert alert-info">
              <h5>No applications to review</h5>
              <p>All applications have been processed.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StaffApplications;