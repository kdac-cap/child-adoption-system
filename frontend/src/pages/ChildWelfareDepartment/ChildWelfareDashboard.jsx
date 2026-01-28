import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { welfareAPI } from "../../services/api";

function ChildWelfareDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [visitDate, setVisitDate] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchScheduledVisits();
  }, []);

  const fetchScheduledVisits = async () => {
    setLoading(true);
    try {
      const response = await welfareAPI.getScheduledVisits();
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error loading scheduled visits:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteVisit = async () => {
    if (!selected || !visitDate || !status || !remarks) {
      alert("Please fill all fields");
      return;
    }

    try {
      const message = `Visit Date: ${visitDate}, Status: ${status}, Remarks: ${remarks}`;
      await welfareAPI.completeVisit(selected.id, message);
      alert("Visit completed successfully");
      setSelected(null);
      setVisitDate("");
      setStatus("");
      setRemarks("");
      fetchScheduledVisits();
    } catch (error) {
      console.error("Error completing visit:", error);
      alert("Failed to complete visit");
    }
  };

  const handleApproveWelfare = async (appId) => {
    const comments = prompt("Enter approval comments:");
    if (!comments) return;

    try {
      await welfareAPI.approveWelfare(appId, comments);
      alert("Welfare check approved successfully");
      fetchScheduledVisits();
    } catch (error) {
      console.error("Error approving welfare:", error);
      alert("Failed to approve welfare check");
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'WELFARE_VISIT_SCHEDULED') return { class: 'bg-primary', text: 'Visit Scheduled' };
    if (status === 'WELFARE_VISIT_COMPLETED') return { class: 'bg-warning', text: 'Visit Completed' };
    return { class: 'bg-secondary', text: status };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container parent-dashboard-container">
        <h3 className="text-center parent-dashboard-title">
          Child Welfare Department Dashboard
        </h3>

        <div className="alert alert-info mt-3">
          <strong>Note:</strong> These are home visits scheduled by the admin. Complete the visits and approve welfare checks.
        </div>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Child</th>
              <th>Parent</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No scheduled visits available
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const statusBadge = getStatusBadge(app.status);
                return (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>
                      <strong>{app.child?.name || app.childName || 'N/A'}</strong>
                      <br />
                      <small className="text-muted">
                        {app.child?.age ? `${app.child.age} years` : ''} • {app.child?.gender || ''}
                      </small>
                    </td>
                    <td>
                      <strong>{app.parent?.fullName || app.parentName || 'N/A'}</strong>
                      <br />
                      <small className="text-muted">{app.parent?.email || ''}</small>
                      <br />
                      <small className="text-muted">{app.parent?.phone || ''}</small>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>
                      {app.status === 'WELFARE_VISIT_SCHEDULED' && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => setSelected(app)}
                        >
                          ✓ Complete Visit
                        </button>
                      )}
                      {app.status === 'WELFARE_VISIT_COMPLETED' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApproveWelfare(app.id)}
                        >
                          ✓ Approve Welfare
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {selected && (
          <div className="card p-3 mt-3">
            <h5>Complete Visit for {selected.child?.name || selected.childName}</h5>

            <div className="mb-3">
              <label className="form-label">Visit Date</label>
              <input
                type="date"
                className="form-control"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Visit Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="WELL_CARED">Well Cared</option>
                <option value="NEEDS_ATTENTION">Needs Attention</option>
                <option value="SATISFACTORY">Satisfactory</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Remarks</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter visit remarks and observations..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={handleCompleteVisit}
              >
                Complete Visit
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelected(null);
                  setVisitDate("");
                  setStatus("");
                  setRemarks("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ChildWelfareDashboard;
