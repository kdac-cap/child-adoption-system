import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import StatsCard from "./StatsCard";
import axios from "axios";
import "./AdminDashboard.css";

const API_URL = "http://localhost:8080/api";

const showNotification = (message, type = "success") => {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
  notification.style.zIndex = "9999";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

/* =========================================================
   ADMIN DASHBOARD COMPONENT
========================================================= */
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, appsRes, usersRes, childrenRes] = await Promise.all([
        axios.get(`${API_URL}/admin/dashboard-stats`, { headers }),
        axios.get(`${API_URL}/admin/applications`, { headers }),
        axios.get(`${API_URL}/admin/users`, { headers }),
        axios.get(`${API_URL}/admin/children`, { headers })
      ]);

      const statsData = statsRes.data;
      setStats([
        { title: "Total Users", value: statsData.totalUsers, color: "primary" },
        { title: "Total Children", value: statsData.totalChildren, color: "info" },
        { title: "Pending Requests", value: statsData.pendingApplications, color: "warning" },
        { title: "Approved", value: statsData.approvedApplications, color: "success" },
        { title: "Rejected", value: statsData.rejectedApplications, color: "danger" },
        { title: "Documents", value: statsData.totalDocuments, color: "secondary" }
      ]);

      setApplications(appsRes.data);
      setUsers(usersRes.data);
      setChildren(childrenRes.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showNotification("Failed to load dashboard data", "danger");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const badgeColor = (status) =>
    status === "APPROVED" ? "success" :
    status === "REJECTED" ? "danger" : "warning";

  /* ================= ACTIONS ================= */
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/admin/applications/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reload data to reflect changes
      await loadDashboardData();
      showNotification(`✓ Application ${status.toLowerCase()} successfully!`, "success");
      setConfirmAction(null);
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification("Failed to update application status", "danger");
    }
  };

  const handleActionClick = (requestId, action) => {
    setConfirmAction({ requestId, action });
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="container-fluid admin-dashboard">
      <h2 className="fw-bold mb-4">📋 Admin Dashboard</h2>

      {/* ================= STATS ================= */}
      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        {stats.map((s, i) => (
          <div key={i} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <StatsCard {...s} />
          </div>
        ))}
      </div>

      {/* ================= REQUEST TABLE ================= */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold small">
          📝 Adoption Applications ({applications.length})
        </div>

        <div className="table-responsive-sm">
          <table className="table table-hover align-middle mb-0 fs-7">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Parent</th>
                <th>Child</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td className="fw-bold">{app.id}</td>
                    <td>{app.parentName}</td>
                    <td>{app.childName} ({app.childAge} years)</td>
                    <td>{new Date(app.submissionDate).toLocaleDateString()}</td>

                    <td>
                      <span className={`badge bg-${badgeColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-primary btn-sm action-btn action-view"
                          onClick={() => setSelectedRequest(app)}
                          title="View full application details"
                          aria-label={`View application ${app.id}`}
                        >
                          👁 View
                        </button>

                        {app.status === "PENDING" ? (
                          <>
                            <button
                              className="btn btn-success btn-sm action-btn action-approve"
                              onClick={() => handleActionClick(app.id, "APPROVED")}
                              title="Approve this adoption application"
                              aria-label={`Approve application ${app.id}`}
                            >
                              ✓ Approve
                            </button>

                            <button
                              className="btn btn-danger btn-sm action-btn action-reject"
                              onClick={() => handleActionClick(app.id, "REJECTED")}
                              title="Reject this adoption application"
                              aria-label={`Reject application ${app.id}`}
                            >
                              ✕ Reject
                            </button>
                          </>
                        ) : (
                          <span className={`badge bg-${badgeColor(app.status)} action-status-badge`}>
                            {app.status === "APPROVED" ? "✓ Approved" : "✕ Rejected"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No adoption applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= REQUEST VIEW MODAL ================= */}
      {selectedRequest && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📋 Application Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>👤 Parent:</strong>
                    </p>
                    <p className="text-muted">
                      {selectedRequest.parentName}
                    </p>
                    <p className="text-muted small">
                      {selectedRequest.parentEmail}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>👶 Child:</strong>
                    </p>
                    <p className="text-muted">
                      {selectedRequest.childName} ({selectedRequest.childAge} years)
                    </p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>📅 Submission Date:</strong>
                    </p>
                    <p className="text-muted">
                      {new Date(selectedRequest.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>📊 Status:</strong>
                    </p>
                    <span
                      className={`badge bg-${badgeColor(
                        selectedRequest.status
                      )}`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRMATION MODAL ================= */}
      {confirmAction && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header bg-light border-0">
                <h5 className="modal-title fw-bold">⚠️ Confirm Action</h5>
                <button
                  className="btn-close"
                  onClick={() => setConfirmAction(null)}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body py-4">
                <p className="mb-0 fs-5">
                  Are you sure you want to mark this application as <strong>{confirmAction.action}</strong>?
                </p>
                <small className="text-muted d-block mt-2">This action cannot be easily undone.</small>
              </div>

              <div className="modal-footer gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmAction(null)}
                >
                  Cancel
                </button>
                <button
                  className={`btn btn-${confirmAction.action === "APPROVED" ? "success" : "danger"}`}
                  onClick={() => updateStatus(confirmAction.requestId, confirmAction.action)}
                >
                  {confirmAction.action === "APPROVED" ? "✓ Approve" : "✕ Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AdminDashboard.propTypes = {};

export default AdminDashboard;
