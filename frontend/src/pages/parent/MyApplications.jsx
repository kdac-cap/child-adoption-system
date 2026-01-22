import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function MyApplications() {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const applications = JSON.parse(localStorage.getItem("applications")) || [];
  
  // Filter applications for current user
  const userApplications = applications.filter(app => app.parentUsername === authUser.username);

  const getStatusBadge = (status) => {
    const statusConfig = {
      "PENDING_STAFF_APPROVAL": { class: "bg-warning", text: "Pending Staff Approval" },
      "DOCUMENTS_REQUESTED": { class: "bg-info", text: "Documents Requested" },
      "DOCUMENTS_SUBMITTED": { class: "bg-primary", text: "Documents Under Review" },
      "APPROVED": { class: "bg-success", text: "Approved" },
      "REJECTED": { class: "bg-danger", text: "Rejected" }
    };
    return statusConfig[status] || { class: "bg-secondary", text: status };
  };

  return (
    <>
      <Navbar />
      <div className="container parent-dashboard-container ">
        <h3 className="text-center parent-dashboard-title">
          📑 My Adoption Applications
        </h3>

        {userApplications.length === 0 && (
          <div className="text-center">
            <div className="alert alert-info">
              <h5>No applications found</h5>
              <p>You haven't submitted any adoption applications yet.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/parent/children")}
              >
                Browse Children
              </button>
            </div>
          </div>
        )}

        <div className="row">
          {userApplications.map((app) => {
            const statusInfo = getStatusBadge(app.status);
            return (
              <div key={app.id} className="col-lg-6 mb-4">
                <div className="card shadow h-100">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">{app.childName}</h5>
                    <small className="text-muted">
                      Applied: {new Date(app.submittedAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <span className={`badge ${statusInfo.class} fs-6`}>
                        {statusInfo.text}
                      </span>
                    </div>

                    {app.staffMessage && (
                      <div className="alert alert-info">
                        <h6 className="alert-heading">💬 Staff Message:</h6>
                        <p className="mb-0">{app.staffMessage}</p>
                      </div>
                    )}

                    {app.status === "DOCUMENTS_REQUESTED" && (
                      <div className="alert alert-warning">
                        <h6 className="alert-heading">📄 Action Required:</h6>
                        <p>Please submit the required documents to proceed with your application.</p>
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => navigate("/parent/documents")}
                        >
                          Submit Documents
                        </button>
                      </div>
                    )}

                    {app.status === "APPROVED" && (
                      <div className="alert alert-success">
                        <h6 className="alert-heading">✅ Congratulations!</h6>
                        <p className="mb-0">Your adoption application has been approved. Our team will contact you soon for the next steps.</p>
                      </div>
                    )}

                    <div className="text-muted small">
                      <i className="fas fa-clock me-1"></i>
                      Last updated: {new Date(app.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default MyApplications;
