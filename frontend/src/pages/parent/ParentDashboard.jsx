import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import notificationService from "../../services/notificationService";
import applicationService from "../../services/applicationService";

function ParentDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    applications: 0,
    documents: 0,
    matches: 0
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (!user) return;

    try {
      // Load notifications from backend
      const notes = await notificationService.getNotificationsByUser(user.id);
      setNotifications(notes || []);

      // Load applications from backend
      const apps = await applicationService.getMyApplications();
      
      setStats({
        applications: apps.length,
        documents: apps.filter(app => app.status === 'DOCUMENTS_SUBMITTED' || app.status === 'DOCUMENTS_VERIFIED').length,
        matches: apps.filter(app => app.status === 'APPROVED').length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const dashboardCards = [
    {
      title: "Browse Children",
      description: "View children available for adoption",
      icon: "child",
      color: "primary",
      route: "/parent/children",
      action: "Browse Now"
    },
    {
      title: "My Applications",
      description: "Track your adoption requests",
      icon: "clipboard-list",
      color: "success",
      route: "/parent/applications",
      action: "View Applications",
      badge: stats.applications
    },
    {
      title: "Documents",
      description: "Submit required documentation",
      icon: "folder-open",
      color: "warning",
      route: "/parent/documents",
      action: "Manage Documents",
      badge: stats.documents
    },
    {
      title: "Testimonials",
      description: "View & share adoption experiences",
      icon: "star",
      color: "info",
      route: "/testimonials",
      action: "Read Stories"
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="dashboard-container">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5 fade-in">
            <h2 className="text-gradient mb-3">
              <i className="fas fa-heart me-2"></i>
              Parent Dashboard
            </h2>
            <p className="lead text-muted">
              Welcome to your adoption journey. Every step brings you closer to your child.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="row mb-5">
            <div className="col-md-4 mb-3">
              <div className="card dashboard-card text-center">
                <div className="dashboard-icon icon-primary">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h4 className="mb-1">{stats.applications}</h4>
                <p className="text-muted mb-0">Active Applications</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card dashboard-card text-center">
                <div className="dashboard-icon icon-success">
                  <i className="fas fa-heart"></i>
                </div>
                <h4 className="mb-1">{stats.matches}</h4>
                <p className="text-muted mb-0">Potential Matches</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card dashboard-card text-center">
                <div className="dashboard-icon icon-warning">
                  <i className="fas fa-folder"></i>
                </div>
                <h4 className="mb-1">{stats.documents}</h4>
                <p className="text-muted mb-0">Documents Uploaded</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="row mb-5">
              <div className="col-12">
                <div className="card dashboard-card">
                  <div className="d-flex align-items-center mb-3">
                    <div className="dashboard-icon icon-info me-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                      <i className="fas fa-bell"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Recent Notifications</h5>
                      <p className="text-muted mb-0">Stay updated with your adoption process</p>
                    </div>
                  </div>
                  <div className="list-group list-group-flush">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="list-group-item border-0 px-0">
                        <div className="d-flex align-items-start">
                          {!notification.read && (
                            <i className="fas fa-circle text-primary me-2 mt-2" style={{ fontSize: '0.5rem' }}></i>
                          )}
                          <div className="flex-grow-1">
                            <strong className="d-block mb-1">{notification.title}</strong>
                            <p className="mb-1">{notification.message}</p>
                            <small className="text-muted">
                              {new Date(notification.createdAt).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {notifications.length > 3 && (
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate('/notifications')}
                      >
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Actions */}
          <div className="row">
            {dashboardCards.map((card, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="card dashboard-card text-center h-100">
                  <div className={`dashboard-icon icon-${card.color}`}>
                    <i className={`fas fa-${card.icon}`}></i>
                  </div>
                  
                  <div className="position-relative">
                    <h5 className="mb-2">{card.title}</h5>
                    {card.badge > 0 && (
                      <span className={`badge status-${card.color === 'primary' ? 'available' : card.color === 'success' ? 'approved' : card.color === 'warning' ? 'matched' : 'under-review'} position-absolute top-0 start-100 translate-middle`}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-muted mb-4">{card.description}</p>
                  
                  <div className="mt-auto">
                    <button
                      className={`btn btn-${card.color} w-100`}
                      onClick={() => navigate(card.route)}
                    >
                      <i className={`fas fa-${card.icon} me-2`}></i>
                      {card.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card dashboard-card">
                <div className="text-center">
                  <h5 className="mb-3">Need Help?</h5>
                  <p className="text-muted mb-4">
                    Our support team is here to guide you through every step of the adoption process.
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/chat')}
                    >
                      <i className="fas fa-comments me-2"></i>
                      Live Chat
                    </button>
                    <button 
                      className="btn btn-outline-success"
                      onClick={() => navigate('/about')}
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      Learn More
                    </button>
                    <button 
                      className="btn btn-outline-warning"
                      onClick={() => navigate('/donate')}
                    >
                      <i className="fas fa-heart me-2"></i>
                      Support Others
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ParentDashboard;
