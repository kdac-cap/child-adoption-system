import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaChild,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaHome,
} from "react-icons/fa";
import { adminAPI } from "../../services/api";

const Sidebar = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(isMobile); // Auto-collapse on mobile
  const [pendingCount, setPendingCount] = useState(0);

  /* --------------------------------------------------
     LIVE PENDING REQUEST COUNT (AUTO UPDATES)
  -------------------------------------------------- */
  useEffect(() => {
    const updatePendingCount = async () => {
      try {
        const response = await adminAPI.getStats();
        setPendingCount(response.data.pendingApplications || 0);
      } catch (error) {
        console.error("Error updating pending count:", error);
      }
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* --------------------------------------------------
     LOGOUT HANDLER
  -------------------------------------------------- */
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authUser");
      navigate("/");
    }
  };

  /* --------------------------------------------------
     STYLES
  -------------------------------------------------- */
  const sidebarWidth = collapsed ? "80px" : "260px";

  const navItemClass = ({ isActive }) =>
    `nav-link d-flex align-items-center text-white mb-2 rounded px-3 py-2 transition-all ${
      isActive
        ? "bg-primary shadow-sm"
        : "text-white-50 hover:bg-dark"
    }`;

  return (
    <aside
      className="bg-dark text-white vh-100 p-2 p-md-3 d-flex flex-column"
      style={{
        width: sidebarWidth,
        transition: "width 0.3s ease",
        overflowY: "auto",
        height: "100vh",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* ---------------- HEADER ---------------- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin")}
            className="d-flex align-items-center gap-2"
          >
            <span className="fs-5 fw-bold">🏛️</span>
            <h6 className="mb-0 fw-bold">Admin</h6>
          </div>
        )}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars />
        </button>
      </div>

      {/* Divider */}
      <hr className="text-white-50" />

      {/* ---------------- MENU SECTION TITLE ---------------- */}
      {!collapsed && (
        <small className="text-white-50 text-uppercase fw-bold mb-2">
          Menu
        </small>
      )}

      {/* ---------------- MENU ITEMS ---------------- */}
      <ul className="nav flex-column flex-grow-1">
        {/* Dashboard */}
        <li className="nav-item">
          <NavLink to="/admin/dashboard" className={navItemClass} title="Dashboard">
            <FaTachometerAlt className="me-2 fs-5" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </li>

        {/* Users */}
        <li className="nav-item">
          <NavLink to="/admin/users" className={navItemClass} title="Users">
            <FaUsers className="me-2 fs-5" />
            {!collapsed && <span>Users</span>}
          </NavLink>
        </li>

        {/* Children */}
        <li className="nav-item">
          <NavLink to="/admin/children" className={navItemClass} title="Children">
            <FaChild className="me-2 fs-5" />
            {!collapsed && <span>Children</span>}
          </NavLink>
        </li>

        {/* Adoption Requests */}
        <li className="nav-item">
          <NavLink to="/admin/requests" className={navItemClass} title="Adoption Requests">
            <FaFileAlt className="me-2 fs-5" />
            {!collapsed && (
              <div className="d-flex align-items-center justify-content-between w-100">
                <span>Requests</span>
                {pendingCount > 0 && (
                  <span className="badge bg-warning text-dark ms-auto">
                    {pendingCount}
                  </span>
                )}
              </div>
            )}
            {collapsed && pendingCount > 0 && (
              <span className="badge bg-warning text-dark position-absolute" style={{ right: "10px" }}>
                {pendingCount}
              </span>
            )}
          </NavLink>
        </li>

        {/* Child Welfare Department */}
        <li className="nav-item">
          <NavLink to="/admin/welfare" className={navItemClass} title="Child Welfare Department">
            <FaHome className="me-2 fs-5" />
            {!collapsed && <span>Welfare Dept</span>}
          </NavLink>
        </li>

        {/* Settings */}
        <li className="nav-item">
          <NavLink to="/admin/settings" className={navItemClass} title="Settings">
            <FaCog className="me-2 fs-5" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </li>
      </ul>

      {/* Divider before logout */}
      <hr className="text-white-50" />

      {/* ---------------- LOGOUT BUTTON ---------------- */}
      <button
        className="btn btn-danger w-100 d-flex align-items-center justify-content-center py-2"
        onClick={handleLogout}
        title="Logout"
      >
        <FaSignOutAlt className="me-2" />
        {!collapsed && "Logout"}
      </button>
    </aside>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
