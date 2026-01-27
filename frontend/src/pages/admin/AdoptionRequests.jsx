import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getData, saveData } from "../../utils/localStorageAPI";

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    setLoading(true);
    try {
      setRequests(getData("adoptions") || []);
      setUsers(getData("users") || []);
      setChildren(getData("children") || []);
    } catch (error) {
      console.error("Error loading adoption requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserName = (id) => users.find((u) => u.id === id)?.name || "Unknown";
  const getChildName = (id) => children.find((c) => c.id === id)?.name || "Unknown";

  const filteredRequests = requests.filter(
    (r) => filterStatus === "all" || r.status === filterStatus
  );

  const handleUpdateStatus = (id, status) => {
    if (!window.confirm(`Confirm ${status}?`)) return;

    const updated = requests.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    setRequests(updated);
    saveData("adoptions", updated);
  };

  const getStatusBadge = (status) => {
    const s = status?.trim().toLowerCase();
    if (s === "approved") return "bg-success";
    if (s === "pending") return "bg-warning text-dark";
    if (s === "rejected") return "bg-danger";
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
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
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
                    <td>{getUserName(r.userId)}</td>
                    <td>{getChildName(r.childId)}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === "Pending" && (
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedRequest(r)}
                            title="View details"
                          >
                            👁 View
                          </button>
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
                      {r.status !== "Pending" && (
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
