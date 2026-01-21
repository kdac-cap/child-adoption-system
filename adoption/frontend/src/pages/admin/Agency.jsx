import React, { useEffect, useState } from "react";
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

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    initializeAgencies();
    const ags = getData("agencies") || [];
    setAgencies(ags);
  }, []);

  /* ================= ACTIONS ================= */
  const updateStatus = (id, status) => {
    const updated = agencies.map(a =>
      a.id === id ? { ...a, status } : a
    );
    setAgencies(updated);
    saveData("agencies", updated);
  };

  return (
    <div className="container-fluid admin-agencies">
      <h2 className="fw-bold mb-4">Agencies Management</h2>

      <div className="card shadow-sm">
        <div className="card-header fw-bold">Agencies List</div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Registration No</th>
                <th>City</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map(agency => (
                <tr key={agency.id}>
                  <td>{agency.id}</td>
                  <td>{agency.name}</td>
                  <td>{agency.regNo}</td>
                  <td>{agency.city}</td>
                  <td>{agency.contact}</td>
                  <td>
                    <span className={`badge bg-${agency.status === "Active" ? "success" : "danger"}`}>
                      {agency.status}
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedAgency(agency)}
                    >
                      <i className="fa fa-eye"></i> View
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => updateStatus(agency.id, "Active")}
                      disabled={agency.status === "Active"}
                    >
                      <i className="fa fa-check"></i> Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => updateStatus(agency.id, "Inactive")}
                      disabled={agency.status === "Inactive"}
                    >
                      <i className="fa fa-times"></i> Deactivate
                    </button>
                  </td>
                </tr>
              ))}
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
                <h5 className="modal-title">Agency Details</h5>
                <button className="btn-close" onClick={() => setSelectedAgency(null)} />
              </div>
              <div className="modal-body">
                <p><b>Name:</b> {selectedAgency.name}</p>
                <p><b>Registration No:</b> {selectedAgency.regNo}</p>
                <p><b>City:</b> {selectedAgency.city}</p>
                <p><b>Contact:</b> {selectedAgency.contact}</p>
                <p><b>Status:</b> {selectedAgency.status}</p>
                <p><b>Registered On:</b> {selectedAgency.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agency;
