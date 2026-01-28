import React, { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGender, setFilterGender] = useState("all");

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      try {
        const response = await adminAPI.getAllChildren();
        setChildren(response.data || []);
      } catch (error) {
        console.error("Error loading children:", error);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChildren();
  }, []);

  const filteredChildren = children.filter(
    (c) => filterGender === "all" || c.gender === filterGender
  );

  const genders = [...new Set(children.map((c) => c.gender))];

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
        <h2 className="mb-0 fs-5 fs-md-4">Children List</h2>
        <span className="badge bg-success fs-6">{filteredChildren.length} total</span>
      </div>

      <div className="mb-3">
        <select
          className="form-select form-select-sm"
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="all">All Genders</option>
          {genders.map((g) => (
            <option key={g} value={g}>
              {g}
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
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredChildren.length > 0 ? (
                filteredChildren.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-bold">{c.id}</td>
                    <td>{c.name}</td>
                    <td>
                      <span className="badge bg-info">{c.age} years</span>
                    </td>
                    <td>{c.gender}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          c.status === "AVAILABLE" ? "success" : c.status === "ADOPTED" ? "primary" : "secondary"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No children found
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

export default Children;
