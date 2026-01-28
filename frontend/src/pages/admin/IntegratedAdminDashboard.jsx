import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#0088FE'];

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    totalChildren: 0,
    pendingApplications: 0
  });
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adoptionDistribution, setAdoptionDistribution] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, appsRes, childrenRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllApplications(),
        adminAPI.getAllChildren()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setApplications(appsRes.data);
      setChildren(childrenRes.data);

      // Calculate adoption distribution based on children status
      const statusCounts = childrenRes.data.reduce((acc, child) => {
        const status = child.status || 'AVAILABLE';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const distribution = Object.entries(statusCounts).map(([status, count]) => ({
        name: status === 'AVAILABLE' ? 'Available for Adoption' : status === 'ADOPTED' ? 'Adopted' : status,
        value: count
      }));

      setAdoptionDistribution(distribution);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      fetchData();
      alert('User deleted successfully');
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleApproveApplication = async (appId) => {
    try {
      await adminAPI.approveApplication(appId);
      fetchData();
      alert('Application approved successfully');
    } catch (error) {
      alert('Failed to approve application');
    }
  };

  const handleRejectApplication = async (appId) => {
    try {
      await adminAPI.rejectApplication(appId);
      fetchData();
      alert('Application rejected successfully');
    } catch (error) {
      alert('Failed to reject application');
    }
  };

  const handleRequestWelfareReview = async (appId) => {
    try {
      await adminAPI.requestWelfareReview(appId);
      fetchData();
      alert('Welfare review requested successfully');
    } catch (error) {
      alert('Failed to request welfare review');
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

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`} 
            onClick={() => setActiveTab('applications')}
          >
            Adoption Requests
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'children' ? 'active' : ''}`} 
            onClick={() => setActiveTab('children')}
          >
            Children
          </button>
        </li>
      </ul>

      {activeTab === 'dashboard' && (
        <>
          <div className="row">
            <div className="col-md-3">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <h2>{stats.totalUsers}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Applications</h5>
                  <h2>{stats.totalApplications}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Children</h5>
                  <h2>{stats.totalChildren}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <h5 className="card-title">Pending Applications</h5>
                  <h2>{stats.pendingApplications}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Adoption Status Distribution</h5>
                  <p className="text-muted">Total Children: {stats.totalChildren} | Distribution by Status</p>
                  {adoptionDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={adoptionDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {adoptionDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted">No children data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">All Users</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td><span className="badge bg-info">{user.role}</span></td>
                        <td>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Adoption Requests</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Child</th>
                    <th>Documents</th>
                    <th>Status</th>
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
                            <strong>{app.parent?.fullName || 'N/A'}</strong>
                            <br />
                            <small className="text-muted">{app.parent?.email || ''}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{app.child?.name || 'N/A'}</strong>
                            <br />
                            <small className="text-muted">
                              {app.child?.age ? `${app.child.age} years` : ''}
                            </small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {app.documents?.length || 0} docs
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${
                            app.status === 'APPROVED' ? 'success' : 
                            app.status === 'REJECTED' ? 'danger' : 
                            app.status === 'PENDING' ? 'warning' : 'info'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.status === 'PENDING' ? (
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-success" 
                                onClick={() => handleApproveApplication(app.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-sm btn-danger" 
                                onClick={() => handleRejectApplication(app.id)}
                              >
                                Reject
                              </button>
                            </div>
                          ) : app.status === 'DOCUMENTS_VERIFIED' ? (
                            <button 
                              className="btn btn-sm btn-info" 
                              onClick={() => handleRequestWelfareReview(app.id)}
                            >
                              Request Welfare Review
                            </button>
                          ) : app.status === 'WELFARE_APPROVED' ? (
                            <button 
                              className="btn btn-sm btn-success" 
                              onClick={() => handleApproveApplication(app.id)}
                            >
                              Final Approve
                            </button>
                          ) : (
                            <span className="text-muted">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No applications found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'children' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">All Children</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {children.length > 0 ? (
                    children.map(child => (
                      <tr key={child.id}>
                        <td>{child.id}</td>
                        <td>{child.name}</td>
                        <td>{child.age}</td>
                        <td>{child.gender}</td>
                        <td>
                          <span className={`badge bg-${child.status === 'AVAILABLE' ? 'success' : child.status === 'ADOPTED' ? 'primary' : 'secondary'}`}>
                            {child.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No children found</td>
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

export default AdminDashboard;
