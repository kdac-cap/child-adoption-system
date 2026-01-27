import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * ManageAgencies - Placeholder for future agency management features
 * Currently displays information about agency management capabilities
 */
const ManageAgencies = () => {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">🔧 Manage Agencies</h1>
      </div>

      {showGuide && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          <strong>📋 Information:</strong> Use the "Agencies" section in the sidebar to view,
          activate, and deactivate adoption agencies. This section is for advanced management features.
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowGuide(false)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">📊 Agency Statistics</h5>
              <p className="text-muted">Comprehensive analytics about registered agencies</p>
              <ul className="list-unstyled">
                <li className="mb-2">✓ Total agencies count</li>
                <li className="mb-2">✓ Active vs inactive agencies</li>
                <li className="mb-2">✓ Registration trends</li>
                <li className="mb-2">✓ Performance metrics</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">⚙️ Agency Configuration</h5>
              <p className="text-muted">Manage agency settings and permissions</p>
              <ul className="list-unstyled">
                <li className="mb-2">✓ Activate/Deactivate agencies</li>
                <li className="mb-2">✓ View agency details</li>
                <li className="mb-2">✓ Contact information</li>
                <li className="mb-2">✓ Audit trail</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">📌 Quick Links</div>
            <div className="card-body">
              <a href="/admin/agencies" className="btn btn-primary me-2">
                👁 View All Agencies
              </a>
              <button className="btn btn-secondary" disabled>
                ➕ Add New Agency (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ManageAgencies.propTypes = {};

export default ManageAgencies;
