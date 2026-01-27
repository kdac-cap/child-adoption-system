import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import { ROLE_ROUTES } from "../../utils/apiConfig";
import { showErrorToast, showSuccessToast } from "../../utils/errorHandler";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    
    try {
      const credentials = {
        username: formData.username,
        password: formData.password
      };
      
      const response = await authService.login(credentials);
      
      if (response.token && response.user) {
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({ username: formData.username }));
        } else {
          localStorage.removeItem('rememberedUser');
        }

        // Store user data for ProtectedRoute
        localStorage.setItem('authUser', JSON.stringify(response.user));

        showSuccessToast(`Welcome back, ${response.user.fullName || response.user.username}!`);
        
        navigate(ROLE_ROUTES[response.user.role] || "/");
      } else {
        showErrorToast(null, "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // If backend is not available, check localStorage
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        console.log('Backend not available, checking localStorage');
        
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => 
          u.username === formData.username && u.password === formData.password
        );
        
        if (user) {
          if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username: formData.username }));
          } else {
            localStorage.removeItem('rememberedUser');
          }
          
          // Store auth info for ProtectedRoute
          localStorage.setItem('authToken', 'localStorage-token-' + Date.now());
          localStorage.setItem('authUser', JSON.stringify({
            username: user.username,
            role: user.role,
            fullName: user.fullName,
            email: user.email
          }));
          
          showSuccessToast(`Welcome back, ${user.fullName || user.username}!`);
          navigate(ROLE_ROUTES[user.role] || "/");
        } else {
          setErrors({ general: "Invalid username or password" });
        }
      } else {
        const errorMessage = showErrorToast(error, "Invalid username or password");
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!validateForgot()) return;
    
    setLoading(true);
    setTimeout(() => {
      showSuccessToast(`Password reset link sent to ${formData.email}`);
      setShowForgot(false);
      setFormData(prev => ({ ...prev, email: '' }));
      setErrors({});
      setLoading(false);
    }, 1000);
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;