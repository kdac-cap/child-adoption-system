import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";

function ParentDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (!user) return;

    const loadNotifications = () => {
      const notes =
        JSON.parse(
          localStorage.getItem(
            `parentNotifications_${user.username}`
          )
        ) || [];

      setNotifications(notes);
    };

    // load once
    loadNotifications();

    // auto refresh every 2 seconds (SAFE, lightweight)
    const interval = setInterval(loadNotifications, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      <div className="container parent-dashboard-container mt-4">
        <h3 className="text-center parent-dashboard-title">
          👨‍👩‍👧 Parent Dashboard
        </h3>

        {/* 🔔 NOTIFICATIONS (always visible, UI unchanged) */}
        <div className="alert alert-info">
          <strong>🔔 Notifications</strong>

          {notifications.length === 0 ? (
            <p className="mb-0 mt-2 text-muted">
              No notifications yet
            </p>
          ) : (
            <ul className="mb-0 mt-2">
              {notifications.map((n) => (
                <li key={n.id}>{n.message}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="row justify-content-center">

          {/* Browse Children (ICON KEPT) */}
          <div className="col-md-3 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-search fa-3x text-primary mb-3"></i>
                <h5>👶 Browse Children</h5>
                <p>View children available for adoption</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/parent/children")}
                >
                  Browse
                </button>
              </div>
            </div>
          </div>

          {/* My Applications */}
          <div className="col-md-3 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-clipboard-list fa-3x text-success mb-3"></i>
                <h5>📄 My Applications</h5>
                <p>Track your adoption requests</p>
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/parent/applications")}
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="col-md-3 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-folder-open fa-3x text-warning mb-3"></i>
                <h5>📁 Documents</h5>
                <p>Submit required documentation</p>
                <button
                  className="btn btn-warning"
                  onClick={() => navigate("/parent/documents")}
                >
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="col-md-3 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-star fa-3x text-info mb-3"></i>
                <h5>Testimonials</h5>
                <p>View & share adoption experiences</p>
                <button
                  className="btn btn-info"
                  onClick={() => navigate("/testimonials")}
                >
                  View / Add
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ParentDashboard;
