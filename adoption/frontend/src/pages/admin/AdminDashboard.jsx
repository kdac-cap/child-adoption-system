import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { getData, saveData } from "../../utils/localStorageAPI";
import "./AdminDashboard.css";

/* =========================================================
   INITIALIZE LOCAL STORAGE DATA (SAFE + LINKED)
========================================================= */
const initializeData = () => {

  /* ================= USERS ================= */
  if (!Array.isArray(getData("users"))) {
    saveData("users", [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "9876543210", city: "Mumbai" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "9123456780", city: "Pune" },
      { id: 3, name: "Catherine Lee", email: "catherine@example.com", phone: "9988776655", city: "Delhi" },
      { id: 4, name: "David Miller", email: "david@example.com", phone: "9090909090", city: "Bangalore" },
      { id: 5, name: "Eva Brown", email: "eva@example.com", phone: "9555444333", city: "Chennai" }
    ]);
  }

  /* ================= CHILDREN ================= */
  if (!Array.isArray(getData("children"))) {
    saveData("children", [
      { id: 1, name: "John", age: 5, gender: "Male", medical: "Healthy" },
      { id: 2, name: "Emma", age: 6, gender: "Female", medical: "Minor Allergy" },
      { id: 3, name: "Liam", age: 4, gender: "Male", medical: "Healthy" }
    ]);
  }

  /* ================= ADOPTIONS ================= */
  if (!Array.isArray(getData("adoptions"))) {
    saveData("adoptions", [
      { id: 1, userId: 1, childId: 2, status: "Pending", date: "2025-12-20" },
      { id: 2, userId: 2, childId: 1, status: "Pending", date: "2025-12-21" },
      { id: 3, userId: 3, childId: 3, status: "Pending", date: "2025-12-22" },
      { id: 4, userId: 4, childId: 2, status: "Approved", date: "2025-12-18" },
      { id: 5, userId: 5, childId: 1, status: "Pending", date: "2025-12-23" }
    ]);
  }
/* ================= AGENCIES ================= */
if (!Array.isArray(getData("agencies"))) {
  saveData("agencies", [
    {
      id: 1,
      name: "Hope Adoption Agency",
      registrationNo: "IND-ADP-001",
      email: "contact@hopeadoption.org",
      phone: "9876543210",
      city: "Mumbai",
      state: "Maharashtra",
      address: "12, Marine Drive, Mumbai - 400001",
      status: "Active",
      establishedYear: 2010
    },
    {
      id: 2,
      name: "Bright Future Adoption Center",
      registrationNo: "IND-ADP-002",
      email: "info@brightfuture.org",
      phone: "9123456780",
      city: "Pune",
      state: "Maharashtra",
      address: "45, Hinjewadi Phase 2, Pune - 411057",
      status: "Active",
      establishedYear: 2014
    },
    {
      id: 3,
      name: "Little Angels Care",
      registrationNo: "IND-ADP-003",
      email: "support@littleangels.org",
      phone: "9988776655",
      city: "Delhi",
      state: "Delhi",
      address: "22, Lajpat Nagar, New Delhi - 110024",
      status: "Inactive",
      establishedYear: 2008
    },
    {
      id: 4,
      name: "Safe Hands Adoption Trust",
      registrationNo: "IND-ADP-004",
      email: "admin@safehands.org",
      phone: "9090909090",
      city: "Bangalore",
      state: "Karnataka",
      address: "88, Indiranagar, Bangalore - 560038",
      status: "Active",
      establishedYear: 2016
    },
    {
      id: 5,
      name: "New Life Adoption Agency",
      registrationNo: "IND-ADP-005",
      email: "hello@newlifeadoption.org",
      phone: "9555444333",
      city: "Chennai",
      state: "Tamil Nadu",
      address: "10, Anna Nagar, Chennai - 600040",
      status: "Pending Verification",
      establishedYear: 2020
    }
  ]);
}
  

  /* ================= DOCUMENTS ================= */
  if (!Array.isArray(getData("documents"))) {
    const dummyPdf = "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr";

    saveData("documents", [
      { id: 1, adoptionId: 1, name: "Income_Certificate.pdf", date: "2025-12-20", fileData: dummyPdf },
      { id: 2, adoptionId: 1, name: "Address_Proof.pdf", date: "2025-12-20", fileData: dummyPdf },

      { id: 3, adoptionId: 2, name: "Medical_Report.pdf", date: "2025-12-21", fileData: dummyPdf },

      { id: 4, adoptionId: 3, name: "Income_Certificate.pdf", date: "2025-12-22", fileData: dummyPdf },
      { id: 5, adoptionId: 3, name: "Police_Verification.pdf", date: "2025-12-22", fileData: dummyPdf },

      { id: 6, adoptionId: 4, name: "Marriage_Certificate.pdf", date: "2025-12-18", fileData: dummyPdf },

      { id: 7, adoptionId: 5, name: "Residence_Proof.pdf", date: "2025-12-23", fileData: dummyPdf }
    ]);
  }
};

/* =========================================================
   ADMIN DASHBOARD COMPONENT
========================================================= */
const AdminDashboard = () => {

  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    initializeData();

    const u = getData("users") || [];
    const c = getData("children") || [];
    const r = getData("adoptions") || [];
    const d = getData("documents") || [];

    setUsers(u);
    setChildren(c);
    setRequests(r);
    setDocuments(d);

    updateStats(r, c.length, u.length, d.length);
  }, []);

  /* ================= STATS ================= */
  const updateStats = (adoptions, childCount, userCount, docCount) => {
    setStats([
      { title: "Children", value: childCount, color: "primary" },
      { title: "Pending", value: adoptions.filter(a => a.status === "Pending").length, color: "warning" },
      { title: "Approve", value: adoptions.filter(a => a.status === "Approved").length, color: "success" },
      { title: "Users", value: userCount, color: "info" },
      { title: "Docx", value: docCount, color: "secondary" },
      { title: "Agency", value: docCount, color: "danger" }
    ]);
  };

  /* ================= HELPERS ================= */
  const getUser = id => users.find(u => u.id === id) || {};
  const getChild = id => children.find(c => c.id === id) || {};
  const getDocsForRequest = id => documents.filter(d => d.adoptionId === id);

  const badgeColor = status =>
    status === "Approved" ? "success" :
    status === "Rejected" ? "danger" : "warning";

  /* ================= ACTIONS ================= */
  const updateStatus = (id, status) => {
    if (!window.confirm(`Confirm ${status}?`)) return;

    const updated = requests.map(r =>
      r.id === id ? { ...r, status } : r
    );

    setRequests(updated);
    saveData("adoptions", updated);
    updateStats(updated, children.length, users.length, documents.length);

    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status });
    }
  };

  const downloadDoc = doc => {
    const a = document.createElement("a");
    a.href = doc.fileData;
    a.download = doc.name;
    a.click();
  };

  /* ================= RENDER ================= */
  return (
    <div className="container-fluid admin-dashboard">

      <h2 className="fw-bold mb-4">Admin Dashboard</h2>

      {/* ================= STATS ================= */}
      <div className="row g-3 mb-4">
        {stats.map((s, i) => (
          <div key={i} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <StatsCard {...s} />
          </div>
        ))}
      </div>

      {/* ================= REQUEST TABLE ================= */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Adoption Requests</div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
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
              {requests.map(req => {
                const docs = getDocsForRequest(req.id);

                return (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{getUser(req.userId).name}</td>
                    <td>{getChild(req.childId).name}</td>

                    {/* DOCUMENT LINKS */}
                    <td>
                      {docs.length === 0 ? (
                        <span className="text-muted small">No Documents</span>
                      ) : (
                        <div className="d-flex flex-wrap gap-2">
                          {docs.map(doc => (
                            <span
                              key={doc.id}
                              onClick={() => downloadDoc(doc)}
                              className="badge bg-light text-primary border document-link"
                              style={{ cursor: "pointer" }}
                              title="Click to download"
                            >
                              📄 {doc.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td>
                      <span className={`badge bg-${badgeColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => setSelectedRequest(req)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => updateStatus(req.id, "Approved")}
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => updateStatus(req.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {selectedRequest && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Adoption Request Details</h5>
                <button className="btn-close" onClick={() => setSelectedRequest(null)} />
              </div>

              <div className="modal-body">

                <div className="row">
                  <div className="col-md-6">
                    <h6>User Information</h6>
                    <p><b>Name:</b> {getUser(selectedRequest.userId).name}</p>
                    <p><b>Email:</b> {getUser(selectedRequest.userId).email}</p>
                    <p><b>Phone:</b> {getUser(selectedRequest.userId).phone}</p>
                    <p><b>City:</b> {getUser(selectedRequest.userId).city}</p>
                  </div>

                  <div className="col-md-6">
                    <h6>Child Information</h6>
                    <p><b>Name:</b> {getChild(selectedRequest.childId).name}</p>
                    <p><b>Age:</b> {getChild(selectedRequest.childId).age}</p>
                    <p><b>Gender:</b> {getChild(selectedRequest.childId).gender}</p>
                    <p><b>Medical:</b> {getChild(selectedRequest.childId).medical}</p>
                  </div>
                </div>

                <hr />

                <p>
                  <b>Status:</b>{" "}
                  <span className={`badge bg-${badgeColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </p>

                <p><b>Applied On:</b> {selectedRequest.date}</p>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
