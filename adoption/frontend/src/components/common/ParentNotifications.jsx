import { useState, useEffect } from 'react';

function ParentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = JSON.parse(localStorage.getItem("parentNotifications")) || [];
    const userNotifications = allNotifications.filter(n => n.parentUsername === authUser.username);
    setNotifications(userNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const markAsRead = (notificationId) => {
    const allNotifications = JSON.parse(localStorage.getItem("parentNotifications")) || [];
    const updatedNotifications = allNotifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem("parentNotifications", JSON.stringify(updatedNotifications));
    loadNotifications();
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return 'fas fa-check-circle text-success';
      case 'error': return 'fas fa-times-circle text-danger';
      case 'warning': return 'fas fa-exclamation-triangle text-warning';
      default: return 'fas fa-info-circle text-info';
    }
  };

  return (
    <div className="dropdown">
      <button 
        className="btn btn-outline-primary position-relative" 
        type="button" 
        data-bs-toggle="dropdown"
      >
        <i className="fas fa-bell"></i>
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>
      <ul className="dropdown-menu dropdown-menu-end" style={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
        <li><h6 className="dropdown-header">Notifications</h6></li>
        {notifications.length === 0 && (
          <li><span className="dropdown-item-text text-muted">No notifications</span></li>
        )}
        {notifications.map(notification => (
          <li key={notification.id}>
            <div 
              className={`dropdown-item ${!notification.read ? 'bg-light' : ''}`}
              onClick={() => markAsRead(notification.id)}
              style={{ cursor: 'pointer', whiteSpace: 'normal' }}
            >
              <div className="d-flex align-items-start">
                <i className={`${getNotificationIcon(notification.type)} me-2 mt-1`}></i>
                <div className="flex-grow-1">
                  <p className="mb-1 small">{notification.message}</p>
                  <small className="text-muted">
                    {new Date(notification.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParentNotifications;