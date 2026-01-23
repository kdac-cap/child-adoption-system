import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/");
  };

  const getDashboardRoute = (role) => {
    switch(role) {
      case 'PARENT': return '/parent';
      case 'ADMIN': return '/admin';
      case 'STAFF': return '/staff';
      case 'AGENCY': return '/agency';
      case 'CHILD_WELFARE': return '/child-welfare';
      default: return '/';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: "#b31567" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="fas fa-heart me-2"></i>
          Hope Adoption Center
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/testimonials">
                <i className="fas fa-star me-1"></i>Testimonials
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/donate">
                <i className="fas fa-donate me-1"></i>Donate
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                <i className="fas fa-info-circle me-1"></i>About Us
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {authUser ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-light dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user me-1"></i>
                  {authUser.username}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to={getDashboardRoute(authUser.role)}
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/notifications">
                      <i className="fas fa-bell me-2"></i>
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/chat">
                      <i className="fas fa-comments me-2"></i>
                      Messages
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/register" className="btn btn-outline-light me-2">
                  <i className="fas fa-user-plus me-1"></i>
                  Register
                </Link>
                <Link to="/login" className="btn btn-light text-dark">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
