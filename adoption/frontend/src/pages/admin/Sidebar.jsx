import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaChild,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaBuilding
} from "react-icons/fa";

import { getData } from './../../utils/localStorageAPI';
import { APPLICATION_STATUS } from '../../utils/constants';

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  /* --------------------------------------------------
     LIVE PENDING REQUEST COUNT (AUTO UPDATES)
  -------------------------------------------------- */
  useEffect(() => {
    const updatePendingCount = () => {
      const applications = JSON.parse(localStorage.getItem("applications")) || [];
      const pending = applications.filter(
        (app) => app.status === APPLICATION_STATUS.PENDING_ADMIN_APPROVAL
      ).length;
      setPendingCount(pending);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 1000); // Check every second

    return () => clearInterval(interval);
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
  const sidebarWidth = collapsed ? "80px" : "250px";

  const navItemClass = ({ isActive }) =>
    `nav-link d-flex align-items-center text-white mb-2 rounded px-3 ${
      isActive ? "bg-primary" : "text-white-50"
    }`;

  return (
    <aside
      className="bg-dark text-white vh-100 p-3 d-flex flex-column position-sticky top-0"
      style={{
        width: sidebarWidth,
        transition: "width 0.3s ease",
      }}
    >
      {/* ---------------- HEADER ---------------- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && (
          <h5
            className="mb-0 fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </h5>
        )}
        <FaBars
          style={{ cursor: "pointer" }}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* ---------------- MENU ---------------- */}
      <ul className="nav flex-column flex-grow-1">

        {/* Dashboard */}
        <li className="nav-item">
          <NavLink to="/admin/dashboard" className={navItemClass}>
            <FaTachometerAlt className="me-2" />
            {!collapsed && "Dashboard"}
          </NavLink>
        </li>

        {/* Users */}
        <li className="nav-item">
          <NavLink to="/admin/users" className={navItemClass}>
            <FaUsers className="me-2" />
            {!collapsed && "Users"}
          </NavLink>
        </li>

        {/* Children */}
        <li className="nav-item">
          <NavLink to="/admin/children" className={navItemClass}>
            <FaChild className="me-2" />
            {!collapsed && "Children"}
          </NavLink>
        </li>

        {/* Adoption Requests */}
        <li className="nav-item">
          <NavLink to="/admin/requests" className={navItemClass}>
            <FaFileAlt className="me-2" />
            {!collapsed && (
              <>
                Adoption Requests
                {pendingCount > 0 && (
                  <span className="badge bg-warning text-dark ms-2">
                    {pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        </li>

        {/* 🆕 Agencies */}
        <li className="nav-item">
          <NavLink to="/admin/agencies" className={navItemClass}>
            <FaBuilding className="me-2" />
            {!collapsed && "Agencies"}
          </NavLink>
        </li>

        {/* Settings */}
        <li className="nav-item">
          <NavLink to="/admin/settings" className={navItemClass}>
            <FaCog className="me-2" />
            {!collapsed && "Settings"}
          </NavLink>
        </li>
      </ul>

      {/* ---------------- LOGOUT ---------------- */}
      <button
        className="btn btn-danger w-100 mt-3 d-flex align-items-center justify-content-center"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="me-2" />
        {!collapsed && "Logout"}
      </button>
    </aside>
  );
};

export default Sidebar;
