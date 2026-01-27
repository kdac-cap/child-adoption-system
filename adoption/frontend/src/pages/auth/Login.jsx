import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      // Simple: send email directly to backend
      const loginData = {
        email: formData.email,
        password: formData.password
      };
      const response = await login(loginData);
      const userRole = response.user?.role;
      
      // Navigate based on role
      if (userRole === "PARENT") navigate("/parent");
      else if (userRole === "ADMIN") navigate("/admin");
      else if (userRole === "STAFF") navigate("/staff");
      else if (userRole === "AGENCY") navigate("/agency");
      else navigate("/");
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email");
      return;
    }
    alert(`Password reset feature will be implemented later. Contact admin for now.`);
    setShowForgot(false);
  };

  // ---------------- UI ----------------
  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #fceabb, #f8b500)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "380px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-3 text-primary">
          Hope Adoption Center
        </h3>

        <p className="text-center text-muted">
          Giving children a loving home ❤️
        </p>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        {/* -------- LOGIN FORM -------- */}
        {!showForgot && (
          <>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="text-end mb-2">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => {
                    setShowForgot(true);
                    setError("");
                  }}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <button 
                className="btn btn-primary w-100 mb-2" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="mb-1">New to adoption journey?</p>
              <button
                className="btn btn-outline-success w-100"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </>
        )}

        {/* -------- FORGOT PASSWORD FORM -------- */}
        {showForgot && (
          <>
            <h5 className="text-center mb-3">Reset Password</h5>
            <p className="text-muted text-center">
              Enter your email to receive reset instructions.
            </p>

            <form onSubmit={handleForgot}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <button className="btn btn-primary w-100 mb-2">
                Send Reset Link
              </button>
            </form>

            <div className="text-center mt-3">
              <button
                className="btn btn-link"
                onClick={() => {
                  setShowForgot(false);
                  setError("");
                }}
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
