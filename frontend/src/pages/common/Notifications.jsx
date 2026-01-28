import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import notificationService from "../../services/notificationService";
import { showErrorToast } from "../../utils/errorHandler";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('authUser'));
      if (!user || !user.id) {
        showErrorToast(null, "User not found. Please login again.");
        return;
      }

      const data = await notificationService.getNotificationsByUser(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      showErrorToast(error, "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      showErrorToast(error, "Failed to delete notification");
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
      <div className="container mt-4">
        <h2 className="mb-4">📬 Notifications</h2>

        {notifications.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="fas fa-bell-slash fa-2x mb-3"></i>
            <h5>No notifications</h5>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="row">
            {notifications.map((notification) => (
              <div key={notification.id} className="col-12 mb-3">
                <div className={`card shadow-sm ${
                  notification.read ? 'border-secondary' : 'border-primary border-2'
                }`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-2">
                          {!notification.read && (
                            <span className="badge bg-primary me-2">New</span>
                          )}
                          {notification.title}
                        </h5>
                        <p className="card-text mb-2">{notification.message}</p>
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {new Date(notification.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        {!notification.read && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(notification.id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Notifications;
