import { useState, useEffect } from 'react';
import { childWelfareAPI } from '../../services/api';

function IntegratedChildWelfareDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await childWelfareAPI.getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = async (appId) => {
    const visitDate = prompt('Enter visit date (YYYY-MM-DD):');
    if (!visitDate) return;

    try {
      await childWelfareAPI.scheduleVisit(appId, {
        visitDate,
        visitType: 'HOME_VISIT',
        notes: 'Scheduled home visit'
      });
      fetchApplications();
      alert('Visit scheduled successfully');
    } catch (error) {
      alert('Failed to schedule visit');
    }
  };

  const handleCompleteVisit = async (visitId) => {
    const report = prompt('Enter visit report:');
    if (!report) return;

    try {
      await childWelfareAPI.completeVisit(visitId, {
        report,
        status: 'COMPLETED'
      });
      fetchApplications();
      alert('Visit completed successfully');
    } catch (error) {
      alert('Failed to complete visit');
    }
  };

  const handleApprove = async (appId) => {
    const comments = prompt('Enter approval comments:');
    if (!comments) return;

    try {
      await childWelfareAPI.approveApplication(appId, comments);
      fetchApplications();
      alert('Application approved - forwarded to admin for final approval');
    } catch (error) {
      alert('Failed to approve application');
    }
  };

  const handleReject = async (appId) => {
    const comments = prompt('Enter rejection reason:');
    if (!comments) return;

    try {
      await childWelfareAPI.rejectApplication(appId, comments);
      fetchApplications();
      alert('Application rejected');
    } catch (error) {
      alert('Failed to reject application');
    }
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Child Welfare Dashboard</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Applications for Review
          </button>
        </li>
      </ul>

      {activeTab === 'applications' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Applications Requiring Welfare Review</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Parent</th>
                    <th>Child</th>
                    <th>Status</th>
                    <th>Visit Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>
                          <div>
                            <strong>{app.parent?.fullName}</strong>
                            <br />
                            <small>{app.parent?.email}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{app.child?.name}</strong>
                            <br />
                            <small>{app.child?.age} years</small>
                          </div>
                        </td>
                        <td>
                          <span className={`badge bg-${
                            app.status === 'WELFARE_APPROVED' ? 'success' :
                            app.status === 'WELFARE_REVIEW_REQUESTED' ? 'warning' : 'info'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.visits && app.visits.length > 0 ? (
                            <span className={`badge bg-${
                              app.visits[0].status === 'COMPLETED' ? 'success' : 'warning'
                            }`}>
                              {app.visits[0].status}
                            </span>
                          ) : (
                            <span className="badge bg-secondary">No Visit</span>
                          )}
                        </td>
                        <td>
                          {app.status === 'WELFARE_REVIEW_REQUESTED' && (!app.visits || app.visits.length === 0) && (
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleScheduleVisit(app.id)}
                            >
                              Schedule Visit
                            </button>
                          )}
                          {app.visits && app.visits.length > 0 && app.visits[0].status === 'SCHEDULED' && (
                            <button 
                              className="btn btn-sm btn-info"
                              onClick={() => handleCompleteVisit(app.visits[0].id)}
                            >
                              Complete Visit
                            </button>
                          )}
                          {app.visits && app.visits.length > 0 && app.visits[0].status === 'COMPLETED' && app.status !== 'WELFARE_APPROVED' && (
                            <div className="btn-group">
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(app.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(app.id)}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No applications for review</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IntegratedChildWelfareDashboard;
