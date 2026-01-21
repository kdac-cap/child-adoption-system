import { Link, useNavigate } from "react-router-dom";
import ParentNotifications from "../common/ParentNotifications";

function Navbar() {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/");
  };

return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{ backgroundColor: "#b31567" }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          ❤️ Hope Adoption Center
        </Link>

        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/testimonials">Testimonials</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/donate">Donate</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/about">About Us</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {authUser && authUser.role === 'parent' && (
              <div className="me-3">
                <ParentNotifications />
              </div>
            )}
            {authUser ? (
              <>
                <span className="text-white me-3">Welcome, {authUser.username}</span>
                <button onClick={handleLogout} className="btn btn-outline-light">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-outline-light me-2">
                  Register
                </Link>
                <Link to="/login" className="btn btn-light text-dark">
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
