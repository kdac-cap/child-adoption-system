import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { adminAPI } from "../../services/api";

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await adminAPI.getAllApplications();
        setRequests(response.data || []);
      } catch (error) {
        console.error("Error loading adoption requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(
    (r) => filterStatus === "all" || r.status === filterStatus
  );

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Confirm ${status}?`)) return;

    try {
      if (status === "Approved") {
        await adminAPI.approveApplication(id);
      } else if (status === "Rejected") {
        await adminAPI.rejectApplication(id);
      }
      // Refresh data
      const response = await adminAPI.getAllApplications();
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.trim().toUpperCase();
    if (s === "APPROVED") return "bg-success";
    if (s === "PENDING" || s === "PENDING_STAFF_APPROVAL") return "bg-warning text-dark";
    if (s === "REJECTED") return "bg-danger";
    if (s === "DOCUMENTS_REQUESTED") return "bg-info";
    if (s === "DOCUMENTS_SUBMITTED") return "bg-primary";
    if (s === "DOCUMENTS_VERIFIED") return "bg-success";
    return "bg-secondary";
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3 mb-md-4">
        <h2 className="mb-0 fs-5 fs-md-4">Adoption Requests</h2>
        <span className="badge bg-primary fs-6">{filteredRequests.length} total</span>
      </div>

      <div className="mb-3">
        <select
          className="form-select form-select-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="PENDING_STAFF_APPROVAL">Pending</option>
          <option value="DOCUMENTS_REQUESTED">Documents Requested</option>
          <option value="DOCUMENTS_SUBMITTED">Documents Submitted</option>
          <option value="DOCUMENTS_VERIFIED">Documents Verified</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Child</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-bold">{r.id}</td>
                    <td>
                      <div>
                        <strong>{r.parent?.fullName || r.parentName || 'N/A'}</strong>
                        <br />
                        <small className="text-muted">{r.parent?.email || ''}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{r.child?.name || r.childName || 'N/A'}</strong>
                        <br />
                        <small className="text-muted">
                          {r.child?.age ? `${r.child.age} years` : ''}
                        </small>
                      </div>
                    </td>
                    <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {(r.status === "PENDING_STAFF_APPROVAL" || r.status === "DOCUMENTS_VERIFIED") && (
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdateStatus(r.id, "Approved")}
                            title="Approve request"
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleUpdateStatus(r.id, "Rejected")}
                            title="Reject request"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                      {r.status !== "PENDING_STAFF_APPROVAL" && r.status !== "DOCUMENTS_VERIFIED" && (
                        <span className="text-muted small">Processed</span>
                      )}
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
    </div>
  );
};

AdoptionRequests.propTypes = {};

export default AdoptionRequests;
