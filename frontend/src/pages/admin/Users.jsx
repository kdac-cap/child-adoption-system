import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { adminAPI } from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await adminAPI.getAllUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error loading users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.fullName || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="container-fluid">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3 mb-md-4">
        <h2 className="mb-0 fs-5 fs-md-4">Users Management</h2>
        <span className="badge bg-primary fs-6">{filteredUsers.length} total</span>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 fs-7">
            <thead className="table-light">
              <tr>
                <th className="d-none d-sm-table-cell">#</th>
                <th>Name</th>
                <th className="d-none d-md-table-cell">Email</th>
                <th className="d-none d-lg-table-cell">Phone</th>
                <th className="d-none d-xl-table-cell">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="fw-bold d-none d-sm-table-cell">{u.id}</td>
                    <td className="fw-5">{u.fullName || u.name}</td>
                    <td className="d-none d-md-table-cell small">{u.email}</td>
                    <td className="d-none d-lg-table-cell small">{u.phone || 'N/A'}</td>
                    <td className="d-none d-xl-table-cell small">
                      <span className="badge bg-info">{u.role}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Users.propTypes = {};

export default Users;
