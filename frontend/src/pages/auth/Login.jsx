import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { isRequired, isEmailValid } from "../../utils/validators";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

<<<<<<< HEAD

  const [resetLink, setResetLink] = useState("");

  // ---------------- DUMMY USERS ----------------
  const dummyUsers = [
    { username: "parent", password: "parent123", role: "PARENT" },
    { username: "admin", password: "admin123", role: "ADMIN" },
    { username: "staff", password: "staff123", role: "STAFF" },
    { username: "childdept", password: "child123", role: "CHILD_WELFARE" },
=======
  // Demo users for testing
  const dummyUsers = [
    { username: "parent", password: "parent123", role: "PARENT", name: "John Parent" },
    { username: "admin", password: "admin123", role: "ADMIN", name: "Admin User" },
    { username: "staff", password: "staff123", role: "STAFF", name: "Staff Member" },
    { username: "agency", password: "agency123", role: "AGENCY", name: "Agency User" },
    { username: "childdept", password: "child123", role: "CHILD_WELFARE", name: "Child Welfare" },
>>>>>>> Update frontend
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    
    if (!isRequired(formData.username)) {
      newErrors.username = "Username is required";
    }
    
    if (!isRequired(formData.password)) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgot = () => {
    const newErrors = {};
    
    if (!isRequired(formData.email)) {
      newErrors.email = "Email is required";
    } else if (!isEmailValid(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLogin()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let user = dummyUsers.find(
        (u) => u.username === formData.username && u.password === formData.password
      );

      if (!user) {
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        user = registeredUsers.find(
          (u) => u.username === formData.username && u.password === formData.password
        );
      }

      if (!user) {
        setErrors({ general: "Invalid username or password" });
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "authUser",
        JSON.stringify({
          username: user.username,
          role: user.role,
          name: user.name || user.username
        })
      );

      toast.success(`Welcome back, ${user.name || user.username}!`);
      
      // Navigate based on role
      const routes = {
        PARENT: "/parent",
        ADMIN: "/admin",
        STAFF: "/staff",
        AGENCY: "/agency",
        CHILD_WELFARE: "/child-welfare"
      };
      
      navigate(routes[user.role] || "/");
      setLoading(false);
    }, 1000);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    
    if (!validateForgot()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Reset instructions sent to ${formData.email}`);
      setShowForgot(false);
      setFormData(prev => ({ ...prev, email: '' }));
      setErrors({});
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-gradient-primary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="dashboard-icon icon-primary mx-auto mb-3">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h3 className="text-gradient mb-2">Hope Adoption Center</h3>
                  <p className="text-muted">Giving children a loving home ❤️</p>
                </div>

                {errors.general && (
                  <div className="alert alert-danger fade-in">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {errors.general}
                  </div>
                )}


                {!showForgot ? (
                  <form onSubmit={handleLogin}>
                    <Input
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      error={errors.username}
                      placeholder="Enter your username"
                      icon="user"
                      required
                    />

                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      error={errors.password}
                      placeholder="Enter your password"
                      icon="lock"
                      required
                    />

                    <div className="text-end mb-3">
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => {
                          setShowForgot(true);
                          setErrors({});
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 mb-3"
                      loading={loading}
                      icon="sign-in-alt"
                    >
                      Login
                    </Button>

                    <div className="text-center">
                      <p className="mb-2 text-muted">New to adoption journey?</p>
                      <Link to="/register" className="btn btn-outline-primary w-100">
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </Link>
                    </div>
                  </form>
                                ) : (
                  <form onSubmit={handleForgot}>
                    <div className="text-center mb-4">
                      <h5>Reset Password</h5>
                      <p className="text-muted">Enter your email to receive reset instructions</p>
                    </div>

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      placeholder="Enter your email"
                      icon="envelope"
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 mb-3"
                      loading={loading}
                      icon="paper-plane"
                    >
                      Send Reset Link
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => {
                          setShowForgot(false);
                          setErrors({});
                          setFormData(prev => ({ ...prev, email: '' }));
                        }}
                      >
                        <i className="fas fa-arrow-left me-1"></i>
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}

                {/* Demo Credentials */}
                <div className="mt-4 p-3 bg-light rounded">
                  <small className="text-muted d-block mb-2">
                    <strong>Demo Credentials:</strong>
                  </small>
                  <small className="text-muted d-block">Parent: parent/parent123</small>
                  <small className="text-muted d-block">Admin: admin/admin123</small>
                  <small className="text-muted d-block">Staff: staff/staff123</small>
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
