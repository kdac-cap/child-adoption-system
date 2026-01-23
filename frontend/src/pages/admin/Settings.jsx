import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { FaMoon, FaSun, FaBell, FaLanguage, FaSave } from "react-icons/fa";

const Settings = () => {
  // FIXED LINE (ONLY CHANGE)
  const { theme, setTheme } = useContext(ThemeContext);

  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    const savedLanguage = localStorage.getItem("language");

    if (savedNotifications !== null)
      setNotifications(savedNotifications === "true");
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const handleSave = () => {
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("language", language);
    alert("Settings saved successfully!");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="p-4 d-flex justify-content-center">
      <div
        className={`card p-4 ${
          theme === "dark" ? "bg-dark text-light" : "bg-white"
        }`}
        style={{
          maxWidth: "450px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <h2 className="mb-4 text-center" style={{ fontWeight: "600" }}>
          ⚙ Settings
        </h2>

        {/* Theme Toggle */}
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <FaSun className="me-2" />
            <span>Theme</span>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="themeToggle"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <label className="form-check-label" htmlFor="themeToggle">
              <FaMoon className="ms-1" />
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-4">
          <label className="form-label d-flex align-items-center mb-2">
            <FaBell className="me-2" /> Notifications
          </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="notifications"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="notifications">
              Enable Notifications
            </label>
          </div>
        </div>

        {/* Language */}
        <div className="mb-4">
          <label className="form-label d-flex align-items-center">
            <FaLanguage className="me-2" /> Language
          </label>
          <select
            className={`form-select ${
              theme === "dark" ? "bg-secondary text-light" : ""
            }`}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          className="btn btn-success d-flex align-items-center justify-content-center"
          style={{ width: "100%", borderRadius: "8px" }}
          onClick={handleSave}
        >
          <FaSave className="me-2" /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
