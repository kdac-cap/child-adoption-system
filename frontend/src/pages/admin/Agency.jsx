import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { getData, saveData } from "../../utils/localStorageAPI";
import "./AdminAgencies.css";

/* =========================================================
   INITIALIZE LOCAL STORAGE DATA FOR AGENCIES
========================================================= */
const initializeAgencies = () => {
  if (!Array.isArray(getData("agencies"))) {
    saveData("agencies", [
      { id: 1, name: "Happy Kids Agency", regNo: "AG001", status: "Active", date: "2025-01-10", contact: "9876543210", city: "Mumbai" },
      { id: 2, name: "Little Stars", regNo: "AG002", status: "Inactive", date: "2025-02-15", contact: "9123456780", city: "Pune" },
      { id: 3, name: "Bright Future", regNo: "AG003", status: "Inactive", date: "2025-03-20", contact: "9988776655", city: "Delhi" },
      { id: 4, name: "Sunshine Agency", regNo: "AG004", status: "Active", date: "2025-04-12", contact: "9090909090", city: "Bangalore" },
      { id: 5, name: "Rainbow Kids", regNo: "AG005", status: "Active", date: "2025-05-18", contact: "9555444333", city: "Chennai" },
    ]);
  }
};

/* =========================================================
   ADMIN AGENCIES COMPONENT
========================================================= */
const Agency = () => {
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    setLoading(true);
    try {
      initializeAgencies();
      const ags = getData("agencies") || [];
      setAgencies(ags);
    } catch (error) {
      console.error("Error loading agencies:", error);
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= ACTIONS ================= */
  const updateStatus = useCallback(
    (id, status) => {
      const updated = agencies.map((a) =>
        a.id === id ? { ...a, status } : a
      );
      setAgencies(updated);
      saveData("agencies", updated);

      if (selectedAgency?.id === id) {
        setSelectedAgency({ ...selectedAgency, status });
      }
    },
    [agencies, selectedAgency]
  );

  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch =
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || agency.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid admin-agencies">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">🏢 Agencies Management</h2>
        <span className="badge bg-primary fs-6">{filteredAgencies.length} agencies</span>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header fw-bold">📋 Agencies List</div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Reg. No</th>
                <th>City</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgencies.length > 0 ? (
                filteredAgencies.map((agency) => (
                  <tr key={agency.id}>
                    <td className="fw-bold">{agency.id}</td>
                    <td>{agency.name}</td>
                    <td>
                      <code>{agency.regNo}</code>
                    </td>
                    <td>{agency.city}</td>
                    <td>
                      <a href={`tel:${agency.contact}`}>{agency.contact}</a>
                    </td>
                    <td>
                      <span
                        className={`badge bg-${
                          agency.status === "Active" ? "success" : "danger"
                        }`}
                      >
                        {agency.status === "Active" ? "✓ Active" : "✕ Inactive"}
                      </span>
                    </td>
                    <td>
                      <small>{new Date(agency.date).toLocaleDateString()}</small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectedAgency(agency)}
                          title="View details"
                        >
                          👁 View
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={() => updateStatus(agency.id, "Active")}
                          disabled={agency.status === "Active"}
                          title="Activate agency"
                        >
                          ✓
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => updateStatus(agency.id, "Inactive")}
                          disabled={agency.status === "Inactive"}
                          title="Deactivate agency"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No agencies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {selectedAgency && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🏢 Agency Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedAgency(null)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Agency Name:</strong>
                    </p>
                    <p className="text-muted">{selectedAgency.name}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Registration No:</strong>
                    </p>
                    <p className="text-muted">
                      <code>{selectedAgency.regNo}</code>
                    </p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>City:</strong>
                    </p>
                    <p className="text-muted">{selectedAgency.city}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Contact:</strong>
                    </p>
                    <p className="text-muted">
                      <a href={`tel:${selectedAgency.contact}`}>
                        {selectedAgency.contact}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Status:</strong>
                    </p>
                    <span
                      className={`badge bg-${
                        selectedAgency.status === "Active"
                          ? "success"
                          : "danger"
                      }`}
                    >
                      {selectedAgency.status === "Active"
                        ? "✓ Active"
                        : "✕ Inactive"}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Registered On:</strong>
                    </p>
                    <p className="text-muted">
                      {new Date(selectedAgency.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedAgency(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Agency.propTypes = {};

export default Agency;
