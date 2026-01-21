import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function ParentDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3 className="text-center mb-4">
          👨‍👩‍👧 Parent Dashboard
        </h3>

        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-search fa-3x text-primary mb-3"></i>
                <h5>👶 Browse Children</h5>
                <p>View children available for adoption</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/parent/children")}
                >
                  Browse
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-clipboard-list fa-3x text-success mb-3"></i>
                <h5>📄 My Applications</h5>
                <p>Track your adoption requests</p>
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/parent/applications")}
                >
                  View
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-folder-open fa-3x text-warning mb-3"></i>
                <h5>📁 Documents</h5>
                <p>Submit required documentation</p>
                <button
                  className="btn btn-warning"
                  onClick={() => navigate("/parent/documents")}
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ParentDashboard;
