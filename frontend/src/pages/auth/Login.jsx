import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const users = [
    { username: "parent", password: "parent123", role: "PARENT", name: "Sarah Johnson" },
    { username: "admin", password: "admin123", role: "ADMIN", name: "Michael Chen" },
    { username: "staff", password: "staff123", role: "STAFF", name: "Emily Davis" },
    { username: "agency", password: "agency123", role: "AGENCY", name: "Hope Agency" },
    { username: "childdept", password: "child123", role: "CHILD_WELFARE", name: "David Wilson" },
  ];

  useEffect(() => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      const userData = JSON.parse(remembered);
      setFormData(prev => ({ ...prev, username: userData.username }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgot = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    setLoading(true);
    setTimeout(() => {
      let user = users.find(u => u.username === formData.username && u.password === formData.password);
      
      if (!user) {
        const registered = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        user = registered.find(u => u.username === formData.username && u.password === formData.password);
      }

      if (!user) {
        setErrors({ general: "Invalid username or password" });
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username: user.username }));
      } else {
        localStorage.removeItem('rememberedUser');
      }

      localStorage.setItem("authUser", JSON.stringify({
        username: user.username,
        role: user.role,
        name: user.name
      }));

      toast.success(`Welcome back, ${user.name}!`);
      
      const routes = {
        PARENT: "/parent",
        ADMIN: "/admin", 
        STAFF: "/staff",
        AGENCY: "/agency",
        CHILD_WELFARE: "/child-welfare"
      };
      
      navigate(routes[user.role] || "/");
      setLoading(false);
    }, 800);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!validateForgot()) return;
    
    setLoading(true);
    setTimeout(() => {
      toast.success(`Password reset link sent to ${formData.email}`);
      setShowForgot(false);
      setFormData(prev => ({ ...prev, email: '' }));
      setErrors({});
      setLoading(false);
    }, 1000);
  };

  const quickLogin = (username, password) => {
    setFormData({ username, password, email: '' });
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 100);
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="card-header bg-white text-center py-4 border-0">
                <div className="mb-3">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-heart text-primary" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
                <h3 className="fw-bold text-dark mb-2">Hope Adoption Center</h3>
                <p className="text-muted mb-0">Connecting families with love</p>
              </div>
              
              <div className="card-body p-4">
                {errors.general && (
                  <div className="alert alert-danger border-0 rounded-3">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {errors.general}
                  </div>
                )}

                {!showForgot ? (
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Username</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="fas fa-user text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control border-start-0 ${errors.username ? 'is-invalid' : ''}`}
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Enter username"
                        />
                      </div>
                      {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="fas fa-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-control border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                      </div>
                      {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label small" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link p-0 small text-decoration-none"
                        onClick={() => setShowForgot(true)}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 mb-3 fw-semibold"
                      disabled={loading}
                      style={{ borderRadius: '10px' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>

                    <div className="text-center">
                      <span className="text-muted small">Don't have an account? </span>
                      <Link to="/register" className="text-decoration-none fw-semibold">
                        Sign up here
                      </Link>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleForgot}>
                    <div className="text-center mb-4">
                      <i className="fas fa-key text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                      <h5 className="fw-bold">Reset Password</h5>
                      <p className="text-muted small">Enter your email to receive reset instructions</p>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="fas fa-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 mb-3 fw-semibold"
                      disabled={loading}
                      style={{ borderRadius: '10px' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => {
                          setShowForgot(false);
                          setErrors({});
                          setFormData(prev => ({ ...prev, email: '' }));
                        }}
                      >
                        <i className="fas fa-arrow-left me-1"></i>
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                )}

                {/* Quick Login Demo */}
                <div className="mt-4 p-3 bg-light rounded-3">
                  <div className="text-center mb-2">
                    <small className="text-muted fw-semibold">Quick Demo Login</small>
                  </div>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => quickLogin('parent', 'parent123')}
                      disabled={loading}
                    >
                      Parent
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={() => quickLogin('admin', 'admin123')}
                      disabled={loading}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => quickLogin('staff', 'staff123')}
                      disabled={loading}
                    >
                      Staff
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;