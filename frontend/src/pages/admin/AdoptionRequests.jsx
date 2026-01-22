import React, { useEffect, useState } from "react";
import { getData, saveData } from "../../utils/localStorageAPI";

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);

  useEffect(() => {
    setRequests(getData("adoptions") || []);
    setUsers(getData("users") || []);
    setChildren(getData("children") || []);
  }, []);

  const getUserName = (id) => users.find(u => u.id === id)?.name || "";
  const getChildName = (id) => children.find(c => c.id === id)?.name || "";

  const handleUpdateStatus = (id, status) => {
    const updated = requests.map(r => r.id === id ? { ...r, status } : r);
    setRequests(updated);
    saveData("adoptions", updated);
  };

  const getStatusBadge = (status) => {
    const s = status?.trim().toLowerCase();
    if (s === "approved") return "bg-success";
    if (s === "pending") return "bg-warning text-dark";
    if (s === "rejected") return "bg-danger";
    return "";
  };

  return (
    <div>
      <h1 className="mb-4">Adoption Requests</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Child</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{getUserName(r.userId)}</td>
              <td>{getChildName(r.childId)}</td>
              <td>
                <span className={`badge ${getStatusBadge(r.status)}`}>{r.status}</span>
              </td>
              <td>
                {r.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleUpdateStatus(r.id, "Approved")}
                    >Approve</button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleUpdateStatus(r.id, "Rejected")}
                    >Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdoptionRequests;
