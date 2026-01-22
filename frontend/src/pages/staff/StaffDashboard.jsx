import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container mt-4 pt-5">
        <h3 className="text-center mb-4">
          👥 Staff Dashboard
        </h3>

        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-tasks fa-3x text-primary mb-3"></i>
                <h5>📋 My Tasks</h5>
                <p>View assigned tasks and activities</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/staff/tasks")}
                >
                  View Tasks
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-file-alt fa-3x text-success mb-3"></i>
                <h5>📄 Review Applications</h5>
                <p>Review and approve adoption applications</p>
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/staff/applications")}
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow text-center p-3 h-100">
              <div className="card-body">
                <i className="fas fa-child fa-3x text-info mb-3"></i>
                <h5>👶 Manage Children</h5>
                <p>Add and manage children profiles</p>
                <button
                  className="btn btn-info"
                  onClick={() => navigate("/staff/children")}
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

export default StaffDashboard;
