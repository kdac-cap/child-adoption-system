import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import applicationService from "../../services/applicationService";
import visitService from "../../services/visitService";
import adminService from "../../services/adminService";
import { showSuccessToast, showErrorToast } from "../../utils/errorHandler";

function ChildWelfareDashboard() {
  const [applications, setApplications] = useState([]);
  const [visits, setVisits] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [visitData, setVisitData] = useState({
    visitDate: "",
    status: "",
    notes: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsData, visitsData] = await Promise.all([
        applicationService.getAllApplications(),
        visitService.getAllVisits()
      ]);
      setApplications(appsData);
      setVisits(visitsData);
    } catch (error) {
      showErrorToast(error, "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = async () => {
    if (!selectedApp || !visitData.visitDate) {
      showErrorToast(null, "Please fill all required fields");
      return;
    }

    try {
      await visitService.scheduleVisit({
        applicationId: selectedApp.id,
        visitDate: visitData.visitDate,
        status: visitData.status || "SCHEDULED",
        notes: visitData.notes
      });
      
      showSuccessToast("Visit scheduled successfully");
      setSelectedApp(null);
      setVisitData({ visitDate: "", status: "", notes: "" });
      loadData();
    } catch (error) {
      showErrorToast(error, "Failed to schedule visit");
    }
  };

  const handleCompleteVisit = async (visitId) => {
    try {
      await visitService.updateVisitStatus(visitId, "COMPLETED", "Visit completed successfully");
      showSuccessToast("Visit marked as completed");
      loadData();
    } catch (error) {
      showErrorToast(error, "Failed to update visit");
    }
  };

  const handleReviewApplication = async (appId, approved) => {
    const comments = prompt(approved ? "Enter approval comments:" : "Enter rejection reason:");
    if (!comments) return;

    try {
      if (approved) {
        await adminService.approveWelfareReview(appId, comments);
        showSuccessToast("Welfare review approved. Application sent to admin for final approval.");
      } else {
        await adminService.rejectApplication(appId, comments);
        showSuccessToast("Application rejected. Parent notified.");
      }
      loadData();
    } catch (error) {
      showErrorToast(error, "Failed to update application");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center p-5">
          <div className="spinner-border"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid p-4">
        <h3 className="mb-4">Child Welfare Department Dashboard</h3>

        {/* Applications Table */}
        <div className="card mb-4">
          <div className="card-header">
            <h5>Applications for Review</h5>
          </div>
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Parent</th>
                  <th>Child</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.filter(app => 
                  app.status === 'WELFARE_VISIT_SCHEDULED' || 
                  app.status === 'WELFARE_VISIT_COMPLETED'
                ).map(app => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.parentName}</td>
                    <td>{app.childName}</td>
                    <td>
                      <span className={`badge bg-${
                        app.status === 'WELFARE_VISIT_COMPLETED' ? 'success' : 'warning'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {app.status === 'WELFARE_VISIT_SCHEDULED' && (
                          <button 
                            className="btn btn-primary"
                            onClick={() => setSelectedApp(app)}
                          >
                            Schedule Visit
                          </button>
                        )}
                        {app.status === 'WELFARE_VISIT_COMPLETED' && (
                          <>
                            <button 
                              className="btn btn-success"
                              onClick={() => handleReviewApplication(app.id, true)}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-danger"
                              onClick={() => handleReviewApplication(app.id, false)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Visits */}
        <div className="card">
          <div className="card-header">
            <h5>Scheduled Visits</h5>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Visit Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visits.map(visit => (
                  <tr key={visit.id}>
                    <td>{visit.applicationId}</td>
                    <td>{new Date(visit.visitDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge bg-${
                        visit.status === 'COMPLETED' ? 'success' : 
                        visit.status === 'SCHEDULED' ? 'primary' : 'warning'
                      }`}>
                        {visit.status}
                      </span>
                    </td>
                    <td>
                      {visit.status === 'SCHEDULED' && (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleCompleteVisit(visit.id)}
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Visit Modal */}
        {selectedApp && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Schedule Visit for Application #{selectedApp.id}</h5>
                  <button className="btn-close" onClick={() => setSelectedApp(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Visit Date</label>
                    <input 
                      type="date"
                      className="form-control"
                      value={visitData.visitDate}
                      onChange={(e) => setVisitData({...visitData, visitDate: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={visitData.status}
                      onChange={(e) => setVisitData({...visitData, status: e.target.value})}
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="IN_PROGRESS">In Progress</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={visitData.notes}
                      onChange={(e) => setVisitData({...visitData, notes: e.target.value})}
                      placeholder="Enter visit notes..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleScheduleVisit}>
                    Schedule Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ChildWelfareDashboard;
