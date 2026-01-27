import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';

function NewAdminDashboard() {
  const [stats, setStats] = useState({});
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, appsData, usersData, logsData] = await Promise.all([
        adminService.getStatistics(),
        adminService.getAllApplications(),
        adminService.getAllUsers(),
        adminService.getAuditLogs()
      ]);
      setStats(statsData);
      setApplications(appsData);
      setUsers(usersData);
      setAuditLogs(logsData);
    } catch (error) {
      showErrorToast(error, 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleWelfareReview = async (appId) => {
    try {
      await adminService.requestWelfareReview(appId);
      showSuccessToast('Welfare review requested. Child Welfare Department notified.');
      loadData();
    } catch (error) {
      showErrorToast(error, 'Failed to request welfare review');
    }
  };

  const handleApprove = async (appId) => {
    const message = prompt('Enter approval message:');
    if (!message) return;
    
    try {
      await adminService.approveApplication(appId, message);
      showSuccessToast('Application approved. Parent notified.');
      loadData();
    } catch (error) {
      showErrorToast(error, 'Failed to approve application');
    }
  };

  const handleReject = async (appId) => {
    const message = prompt('Enter rejection reason:');
    if (!message) return;
    
    try {
      await adminService.rejectApplication(appId, message);
      showSuccessToast('Application rejected. Parent notified.');
      loadData();
    } catch (error) {
      showErrorToast(error, 'Failed to reject application');
    }
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h3>{stats.totalUsers || 0}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h3>{stats.totalApplications || 0}</h3>
              <p>Total Applications</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h3>{stats.pendingApplications || 0}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h3>{stats.totalChildren || 0}</h3>
              <p>Total Children</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`} 
            onClick={() => setActiveTab('applications')}>
            Applications
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} 
            onClick={() => setActiveTab('users')}>
            Users
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'audit' ? 'active' : ''}`} 
            onClick={() => setActiveTab('audit')}>
            Audit Logs
          </button>
        </li>
      </ul>

      {/* Applications Table */}
      {activeTab === 'applications' && (
      <div className="card">
        <div className="card-header">
          <h5>All Applications</h5>
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
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.parentName}</td>
                  <td>{app.childName}</td>
                  <td>
                    <span className={`badge bg-${
                      app.status === 'APPROVED' ? 'success' :
                      app.status === 'REJECTED' ? 'danger' :
                      app.status === 'WELFARE_APPROVED' ? 'info' : 'warning'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-info" onClick={() => setSelectedApp(app)}>
                        View
                      </button>
                      {app.status === 'DOCUMENTS_VERIFIED' && (
                        <button className="btn btn-primary" onClick={() => handleWelfareReview(app.id)}>
                          Request Welfare Review
                        </button>
                      )}
                      {app.status === 'WELFARE_APPROVED' && (
                        <button className="btn btn-success" onClick={() => handleApprove(app.id)}>
                          Final Approve
                        </button>
                      )}
                      {(app.status === 'PENDING_STAFF_APPROVAL' || app.status === 'DOCUMENTS_VERIFIED') && (
                        <button className="btn btn-danger" onClick={() => handleReject(app.id)}>
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
      <div className="card">
        <div className="card-header">
          <h5>User Management</h5>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td><span className="badge bg-secondary">{user.role}</span></td>
                  <td>
                    <button className="btn btn-sm btn-danger" 
                      onClick={async () => {
                        if (window.confirm('Delete user?')) {
                          try {
                            await adminService.deleteUser(user.id);
                            showSuccessToast('User deleted');
                            loadData();
                          } catch (error) {
                            showErrorToast(error, 'Failed to delete user');
                          }
                        }
                      }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Audit Logs */}
      {activeTab === 'audit' && (
      <div className="card">
        <div className="card-header">
          <h5>Audit Logs (Recent 100)</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Performed By</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>
                      <span className={`badge bg-${
                        log.action.includes('APPROVED') ? 'success' :
                        log.action.includes('REJECTED') ? 'danger' :
                        log.action.includes('REQUESTED') ? 'warning' : 'info'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.entityType} #{log.entityId}</td>
                    <td>{log.performedBy}</td>
                    <td><small>{log.details}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Application Details</h5>
                <button className="btn-close" onClick={() => setSelectedApp(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {selectedApp.id}</p>
                <p><strong>Parent:</strong> {selectedApp.parentName}</p>
                <p><strong>Child:</strong> {selectedApp.childName}</p>
                <p><strong>Status:</strong> {selectedApp.status}</p>
                <p><strong>Submitted:</strong> {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                {selectedApp.staffMessage && (
                  <p><strong>Message:</strong> {selectedApp.staffMessage}</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewAdminDashboard;
