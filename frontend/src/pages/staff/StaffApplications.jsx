import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import Navbar from "../../components/layout/Navbar";
import applicationService from "../../services/applicationService";

function StaffApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDocuments = async (appId) => {
    try {
      await applicationService.requestDocuments(appId, {
        message: "Your application has been approved! Please submit the required documents to proceed with the adoption process."
      });
      toast.success("Documents requested from parent!");
      await loadApplications();
    } catch (error) {
      console.error('Error requesting documents:', error);
      toast.error('Failed to request documents');
    }
  };

  const handleRejectApplication = async (appId) => {
    if (!message.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await applicationService.updateApplicationStatus(appId, {
        status: "REJECTED",
        message: message
      });
      toast.success("Application rejected and parent notified!");
      setMessage("");
      setSelectedApp(null);
      await loadApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container parent-dashboard-container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading applications...</p>
          </div>
        </div>
      </>
    );
  }

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
                          onClick={() => handleRequestDocuments(app.id)}
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
