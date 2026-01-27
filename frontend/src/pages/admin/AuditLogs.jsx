import React, { useEffect, useState } from "react";
import { getData } from "../../utils/localStorageAPI";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    setLoading(true);
    try {
      // Fetch all operations from different data stores
      const adoptions = getData("adoptions") || [];
      const generatedLogs = adoptions
        .map((adoption, index) => ({
          id: index + 1,
          type: "Adoption",
          action: `Request #${adoption.id} - Status: ${adoption.status}`,
          user: "Admin",
          timestamp: adoption.date,
          status: "Success",
          details: `Child ID: ${adoption.childId}, User ID: ${adoption.userId}`,
        }))
        .reverse();

      setLogs(generatedLogs);
    } catch (error) {
      console.error("Error loading audit logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredLogs = logs.filter(
    (log) => filterType === "all" || log.type === filterType
  );

  const logTypes = [...new Set(logs.map((log) => log.type))];

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">📜 Audit Logs</h1>
        <span className="badge bg-info fs-6">{filteredLogs.length} logs</span>
      </div>

      <div className="mb-3">
        <select
          className="form-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Activities</option>
          {logTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Action</th>
                <th>User</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="fw-bold">{log.id}</td>
                    <td>
                      <small>{new Date(log.timestamp).toLocaleString()}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{log.type}</span>
                    </td>
                    <td>{log.action}</td>
                    <td>{log.user}</td>
                    <td>
                      <span className="badge bg-success">{log.status}</span>
                    </td>
                    <td>
                      <small className="text-muted">{log.details}</small>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No audit logs found
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

export default AuditLogs;
