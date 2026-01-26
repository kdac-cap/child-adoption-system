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
      { id: 4, adoptionId: 3, name: "Police_Verification.pdf", date: "2025-12-22", fileData: dummyPdf }
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

  // ✅ NEW: Document Preview
  const [previewDoc, setPreviewDoc] = useState(null);

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
      { title: "Approved", value: adoptions.filter(a => a.status === "Approved").length, color: "success" },
      { title: "Users", value: userCount, color: "info" },
      { title: "Documents", value: docCount, color: "secondary" }
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

                    {/* DOCUMENT PREVIEW */}
                    <td>
                      {docs.map(doc => (
                        <span
                          key={doc.id}
                          onClick={() => setPreviewDoc(doc)}
                          className="badge bg-light text-primary border me-2"
                          style={{ cursor: "pointer" }}
                        >
                          📄 {doc.name}
                        </span>
                      ))}
                    </td>

                    <td>
                      <span className={`badge bg-${badgeColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedRequest(req)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* ================= DOCUMENT PREVIEW MODAL ================= */}
      {previewDoc && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">{previewDoc.name}</h5>
                <button className="btn-close" onClick={() => setPreviewDoc(null)} />
              </div>

              <div className="modal-body p-0">
                <iframe
                  src={previewDoc.fileData}
                  title="Preview"
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => downloadDoc(previewDoc)}
                >
                  Download
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPreviewDoc(null)}
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

export default AdminDashboard;
