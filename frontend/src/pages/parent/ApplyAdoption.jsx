import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function ApplyAdoption() {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state;

  if (!child) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-danger text-center">
            Child information not found. Please go back and select a child.
          </div>
        </div>
      </>
    );
  }

  const handleApply = () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const applications =
      JSON.parse(localStorage.getItem("applications")) || [];

    const newApplication = {
      id: Date.now(),
      parentUsername: authUser.username,
      parentName: authUser.username,
      childId: child.id,
      childName: child.name,
      status: "PENDING_STAFF_APPROVAL",
      submittedAt: new Date().toISOString(),
      staffMessage: "",
    };

    applications.push(newApplication);
    localStorage.setItem(
      "applications",
      JSON.stringify(applications)
    );

    // -------------------------------------------------
    // ✅ ADDITION (REQUIRED FOR CHILD WELFARE DASHBOARD)
    // -------------------------------------------------
    const adoptions =
      JSON.parse(localStorage.getItem("adoptions")) || [];

    adoptions.push({
      id: newApplication.id, // same ID for traceability
      childId: child.id,
      childName: child.name,
      parentUsername: authUser.username,

      visitDate: null,
      visitStatus: null,
      remarks: null,
    });

    localStorage.setItem("adoptions", JSON.stringify(adoptions));
    // -------------------------------------------------

    // Add notification for staff (KEEP AS IS)
    const staffNotifications =
      JSON.parse(localStorage.getItem("staffNotifications")) ||
      [];

    staffNotifications.push({
      id: Date.now(),
      message: `New adoption application from ${authUser.username} for ${child.name}`,
      type: "info",
      read: false,
      applicationId: newApplication.id,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(
      "staffNotifications",
      JSON.stringify(staffNotifications)
    );

    alert(
      "Adoption application submitted successfully! Staff will review your application."
    );
    navigate("/parent/applications");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">📝 Apply for Adoption</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img
                      src={child.photo}
                      alt={child.name}
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <h5 className="text-primary">{child.name}</h5>

                    <div className="mb-3">
                      <span className="badge bg-info me-2">
                        Age: {child.age}
                      </span>
                      <span className="badge bg-warning">
                        {child.gender}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-muted">Description:</h6>
                      <p>{child.description}</p>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-muted">Health Report:</h6>
                      <p className="text-success">
                        {child.healthReport}
                      </p>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-muted">Foster History:</h6>
                      <p className="text-info">
                        {child.fosterHistory}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info">
                  <h6>📋 Application Process:</h6>
                  <ol className="mb-0">
                    <li>Submit this application</li>
                    <li>Staff will review and approve</li>
                    <li>
                      You'll receive a message to submit documents
                    </li>
                    <li>Admin will verify your documents</li>
                    <li>
                      Final approval and adoption process begins
                    </li>
                  </ol>
                </div>

                <div className="text-center">
                  <button
                    className="btn btn-success btn-lg me-3"
                    onClick={handleApply}
                  >
                    Confirm Application
                  </button>
                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={() =>
                      navigate("/parent/children")
                    }
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplyAdoption;
