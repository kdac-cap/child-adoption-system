import React, { useEffect, useState } from "react";
import { welfareAPI } from "../../services/api";

const WelfareDepartment = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [visitMessage, setVisitMessage] = useState("");
  const [actionType, setActionType] = useState(""); // 'schedule', 'complete', 'approve'

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await welfareAPI.getPendingVisits();
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error loading applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = async () => {
    try {
      await welfareAPI.scheduleVisit(selectedApp.id, visitMessage || "Home visit scheduled");
      alert("Home visit scheduled successfully");
      closeModal();
      fetchApplications();
    } catch (error) {
      console.error("Error scheduling visit:", error);
      alert("Failed to schedule visit");
    }
  };

  const handleCompleteVisit = async () => {
    try {
      await welfareAPI.completeVisit(selectedApp.id, visitMessage || "Home visit completed");
      alert("Visit marked as completed");
      closeModal();
      fetchApplications();
    } catch (error) {
      console.error("Error completing visit:", error);
      alert("Failed to complete visit");
    }
  };

  const handleApproveWelfare = async () => {
    try {
      await welfareAPI.approveWelfare(selectedApp.id, visitMessage || "Welfare check approved");
      alert("Welfare check approved successfully");
      closeModal();
      fetchApplications();
    } catch (error) {
      console.error("Error approving welfare:", error);
      alert("Failed to approve welfare check");
    }
  };

  const openModal = (app, type) => {
    setSelectedApp(app);
    setActionType(type);
    setVisitMessage("");
  };

  const closeModal = () => {
    setSelectedApp(null);
    setActionType("");
    setVisitMessage("");
  };

  const handleSubmit = () => {
    if (actionType === 'schedule') handleScheduleVisit();
    else if (actionType === 'complete') handleCompleteVisit();
    else if (actionType === 'approve') handleApproveWelfare();
  };

  const getStatusBadge = (status) => {
    if (status === 'DOCUMENTS_SUBMITTED') return { class: 'bg-info', text: 'Documents Submitted' };
    if (status === 'DOCUMENTS_VERIFIED') return { class: 'bg-success', text: 'Documents Verified' };
    if (status === 'WELFARE_VISIT_SCHEDULED') return { class: 'bg-primary', text: 'Visit Scheduled' };
    if (status === 'WELFARE_VISIT_COMPLETED') return { class: 'bg-warning', text: 'Visit Completed' };
    return { class: 'bg-secondary', text: status };
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Child Welfare Department</h2>
        <span className="badge bg-primary fs-6">{applications.length} applications</span>
      </div>

      <div className="alert alert-info">
        <strong>Note:</strong> These are parents whose documents have been submitted/verified and are ready for home visits.
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Parent Details</th>
                <th>Child Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => {
                  const statusBadge = getStatusBadge(app.status);
                  return (
                    <tr key={app.id}>
                      <td className="fw-bold">{app.id}</td>
                      <td>
                        <div>
                          <strong>{app.parent?.fullName || app.parentName || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">{app.parent?.email || ''}</small>
                          <br />
                          <small className="text-muted">{app.parent?.phone || ''}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{app.child?.name || app.childName || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">
                            {app.child?.age ? `${app.child.age} years` : ''} • {app.child?.gender || ''}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          {(app.status === 'DOCUMENTS_SUBMITTED' || app.status === 'DOCUMENTS_VERIFIED') && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openModal(app, 'schedule')}
                              title="Schedule home visit"
                            >
                              🏠 Home Visit
                            </button>
                          )}
                          {app.status === 'WELFARE_VISIT_SCHEDULED' && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => openModal(app, 'complete')}
                              title="Complete visit"
                            >
                              ✓ Complete Visit
                            </button>
                          )}
                          {app.status === 'WELFARE_VISIT_COMPLETED' && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => openModal(app, 'approve')}
                              title="Approve welfare"
                            >
                              ✓ Approve Welfare
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No applications pending for home visits
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {selectedApp && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {actionType === 'schedule' && '🏠 Schedule Home Visit'}
                  {actionType === 'complete' && '✓ Complete Home Visit'}
                  {actionType === 'approve' && '✓ Approve Welfare Check'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Parent:</strong> {selectedApp.parent?.fullName || selectedApp.parentName}
                </div>
                <div className="mb-3">
                  <strong>Child:</strong> {selectedApp.child?.name || selectedApp.childName}
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    {actionType === 'schedule' && 'Visit Schedule & Notes:'}
                    {actionType === 'complete' && 'Visit Completion Notes:'}
                    {actionType === 'approve' && 'Approval Comments:'}
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={visitMessage}
                    onChange={(e) => setVisitMessage(e.target.value)}
                    placeholder={
                      actionType === 'schedule' ? 'Enter visit schedule and notes...' :
                      actionType === 'complete' ? 'Enter visit completion notes...' :
                      'Enter approval comments...'
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  {actionType === 'schedule' && 'Schedule Visit'}
                  {actionType === 'complete' && 'Complete Visit'}
                  {actionType === 'approve' && 'Approve Welfare'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelfareDepartment;
