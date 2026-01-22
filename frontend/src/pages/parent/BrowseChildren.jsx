import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function BrowseChildren() {
  const navigate = useNavigate();
  
  // Load children from localStorage (added by staff)
  const childrenData = JSON.parse(localStorage.getItem("childrenData")) || [];
  const availableChildren = childrenData.filter(child => child.status === "AVAILABLE");

  return (
    <>
      <Navbar />
      <div className="container parent-dashboard-container">
        <div className="text-center mb-4">
          <h3 className="display-6 fw-bold text-primary parent-dashboard-title ">
            💖 Children Available for Adoption
          </h3>
          <p className="text-muted">Find your perfect match and start your adoption journey</p>
        </div>

        {availableChildren.length === 0 && (
          <div className="text-center">
            <div className="alert alert-info">
              <h5>No children available at the moment</h5>
              <p>Please check back later or contact our staff for more information.</p>
            </div>
          </div>
        )}

        <div className="row">
          {availableChildren.map((child) => (
            <div key={child.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-lg h-100 border-0">
                <div className="position-relative">
                  <img 
                    src={child.photo} 
                    className="card-img-top" 
                    alt={child.name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-success">Available</span>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <div className="text-center mb-3">
                    <h4 className="card-title text-primary fw-bold">{child.name}</h4>
                    <div className="mb-3">
                      <span className="badge bg-info me-2 fs-6">Age: {child.age}</span>
                      <span className="badge bg-warning fs-6">{child.gender}</span>
                    </div>
                  </div>

                  {child.description && (
                    <div className="mb-3">
                      <h6 className="text-muted fw-bold">
                        <i className="fas fa-user me-2"></i>About:
                      </h6>
                      <p className="small text-dark">{child.description}</p>
                    </div>
                  )}

                  {child.healthReport && (
                    <div className="mb-3">
                      <h6 className="text-muted fw-bold">
                        <i className="fas fa-heartbeat me-2"></i>Health:
                      </h6>
                      <p className="small text-success">{child.healthReport}</p>
                    </div>
                  )}

                  {child.fosterHistory && (
                    <div className="mb-3">
                      <h6 className="text-muted fw-bold">
                        <i className="fas fa-history me-2"></i>Foster History:
                      </h6>
                      <p className="small text-info">{child.fosterHistory}</p>
                    </div>
                  )}

                  {child.addedBy && (
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="fas fa-user-tie me-1"></i>
                        Added by: {child.addedBy}
                      </small>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      className="btn btn-primary btn-lg w-100"
                      onClick={() =>
                        navigate(`/parent/apply/${child.id}`, {
                          state: child,
                        })
                      }
                    >
                      <i className="fas fa-heart me-2"></i>
                      Apply for Adoption
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BrowseChildren;
