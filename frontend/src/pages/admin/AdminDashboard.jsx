import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import StatsCard from "./StatsCard";
import { getData, saveData } from "../../utils/localStorageAPI";
import "./AdminDashboard.css";

const showNotification = (message, type = "success") => {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
  notification.style.zIndex = "9999";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

/* =========================================================
   INITIALIZE LOCAL STORAGE DATA
========================================================= */
const initializeData = () => {
  if (!Array.isArray(getData("users"))) {
    saveData("users", [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "9876543210", city: "Mumbai" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "9123456780", city: "Pune" },
      { id: 3, name: "Catherine Lee", email: "catherine@example.com", phone: "9988776655", city: "Delhi" },
      { id: 4, name: "David Miller", email: "david@example.com", phone: "9090909090", city: "Bangalore" },
      { id: 5, name: "Eva Brown", email: "eva@example.com", phone: "9555444333", city: "Chennai" }
    ]);
  }

  if (!Array.isArray(getData("children"))) {
    saveData("children", [
      { id: 1, name: "John", age: 5, gender: "Male", medical: "Healthy" },
      { id: 2, name: "Emma", age: 6, gender: "Female", medical: "Minor Allergy" },
      { id: 3, name: "Liam", age: 4, gender: "Male", medical: "Healthy" }
    ]);
  }

  if (!Array.isArray(getData("adoptions"))) {
    saveData("adoptions", [
      { id: 1, userId: 1, childId: 2, status: "Pending", date: "2025-12-20" },
      { id: 2, userId: 2, childId: 1, status: "Pending", date: "2025-12-21" },
      { id: 3, userId: 3, childId: 3, status: "Pending", date: "2025-12-22" },
      { id: 4, userId: 4, childId: 2, status: "Approved", date: "2025-12-18" }
    ]);
  }

  if (!Array.isArray(getData("documents"))) {
    const dummyPdf =
      "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr";

    saveData("documents", [
      { id: 1, adoptionId: 1, name: "Income_Certificate.pdf", date: "2025-12-20", fileData: dummyPdf },
      { id: 2, adoptionId: 1, name: "Address_Proof.pdf", date: "2025-12-20", fileData: dummyPdf },
      { id: 3, adoptionId: 2, name: "Medical_Report.pdf", date: "2025-12-21", fileData: dummyPdf },
      { id: 4, adoptionId: 3, name: "Police_Verification.pdf", date: "2025-12-22", fileData: dummyPdf }
    ]);
  }
};

/* =========================================================
   ADMIN DASHBOARD COMPONENT
========================================================= */
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    setLoading(true);
    try {
      initializeData();

      const u = getData("users") || [];
      const c = getData("children") || [];
      const r = getData("adoptions") || [];
      const d = getData("documents") || [];

      setUsers(u);
      setChildren(c);
      setRequests(r);
      setDocuments(d);

      updateStats(r, c.length, u.length, d.length);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= STATS ================= */
  const updateStats = useCallback((adoptions, childCount, userCount, docCount) => {
    const pending = adoptions.filter((a) => a.status === "Pending").length;
    const approved = adoptions.filter((a) => a.status === "Approved").length;
    const rejected = adoptions.filter((a) => a.status === "Rejected").length;

    setStats([
      { title: "Total Users", value: userCount, color: "primary" },
      { title: "Total Children", value: childCount, color: "info" },
      { title: "Pending Requests", value: pending, color: "warning" },
      { title: "Approved", value: approved, color: "success" },
      { title: "Rejected", value: rejected, color: "danger" },
      { title: "Documents", value: docCount, color: "secondary" }
    ]);
  }, []);

  /* ================= HELPERS ================= */
  const getUser = useCallback((id) => users.find((u) => u.id === id) || {}, [users]);
  const getChild = useCallback((id) => children.find((c) => c.id === id) || {}, [children]);
  const getDocs = useCallback((id) => documents.filter((d) => d.adoptionId === id), [documents]);

  const badgeColor = (status) =>
    status === "Approved" ? "success" :
    status === "Rejected" ? "danger" : "warning";

  /* ================= ACTIONS ================= */
  const updateStatus = (id, status) => {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status } : r
    );

    setRequests(updated);
    saveData("adoptions", updated);
    updateStats(updated, children.length, users.length, documents.length);

    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status });
    }

    showNotification(`✓ Request ${status.toLowerCase()} successfully!`, "success");
    setConfirmAction(null);
  };

  const handleActionClick = (requestId, action) => {
    setConfirmAction({ requestId, action });
  };

  const downloadDoc = (doc) => {
    try {
      const a = document.createElement("a");
      a.href = doc.fileData;
      a.download = doc.name;
      a.click();
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document");
    }
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
          📝 Adoption Requests ({requests.length})
        </div>

        <div className="table-responsive-sm">
          <table className="table table-hover align-middle mb-0 fs-7">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Child</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td className="fw-bold">{req.id}</td>
                    <td>{getUser(req.userId)?.name || "Unknown"}</td>
                    <td>{getChild(req.childId)?.name || "Unknown"}</td>

                    <td>
                      {getDocs(req.id).length > 0 ? (
                        getDocs(req.id).map((doc) => (
                          <span
                            key={doc.id}
                            onClick={() => setPreviewDoc(doc)}
                            className="badge bg-light text-primary border me-2 cursor-pointer"
                            style={{ cursor: "pointer" }}
                            title="Click to preview"
                          >
                            📄 {doc.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small">No documents</span>
                      )}
                    </td>

                    <td>
                      <span className={`badge bg-${badgeColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-primary btn-sm action-btn action-view"
                          onClick={() => setSelectedRequest(req)}
                          title="View full request details"
                          aria-label={`View request ${req.id}`}
                        >
                          👁 View
                        </button>

                        {req.status === "Pending" ? (
                          <>
                            <button
                              className="btn btn-success btn-sm action-btn action-approve"
                              onClick={() => handleActionClick(req.id, "Approved")}
                              title="Approve this adoption request"
                              aria-label={`Approve request ${req.id}`}
                            >
                              ✓ Approve
                            </button>

                            <button
                              className="btn btn-danger btn-sm action-btn action-reject"
                              onClick={() => handleActionClick(req.id, "Rejected")}
                              title="Reject this adoption request"
                              aria-label={`Reject request ${req.id}`}
                            >
                              ✕ Reject
                            </button>
                          </>
                        ) : (
                          <span className={`badge bg-${badgeColor(req.status)} action-status-badge`}>
                            {req.status === "Approved" ? "✓ Approved" : "✕ Rejected"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No adoption requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= DOCUMENT PREVIEW MODAL ================= */}
      {previewDoc && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{previewDoc.name}</h5>
                <button
                  className="btn-close"
                  onClick={() => setPreviewDoc(null)}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body p-0">
                <iframe
                  src={previewDoc.fileData}
                  title="Document Preview"
                  width="100%"
                  height="600px"
                  frameBorder="0"
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => downloadDoc(previewDoc)}
                >
                  📥 Download
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPreviewDoc(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= REQUEST VIEW MODAL ================= */}
      {selectedRequest && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📋 Request Details</h5>
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
                      <strong>👤 User:</strong>
                    </p>
                    <p className="text-muted">
                      {getUser(selectedRequest.userId)?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>👶 Child:</strong>
                    </p>
                    <p className="text-muted">
                      {getChild(selectedRequest.childId)?.name || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>📅 Date:</strong>
                    </p>
                    <p className="text-muted">
                      {new Date(selectedRequest.date).toLocaleDateString()}
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
                  Are you sure you want to mark this request as <strong>{confirmAction.action}</strong>?
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
                  className={`btn btn-${confirmAction.action === "Approved" ? "success" : "danger"}`}
                  onClick={() => updateStatus(confirmAction.requestId, confirmAction.action)}
                >
                  {confirmAction.action === "Approved" ? "✓ Approve" : "✕ Reject"}
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
