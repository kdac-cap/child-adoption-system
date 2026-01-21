import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  // ---------------- DUMMY USERS ----------------
  const dummyUsers = [
    { username: "parent", password: "parent123", role: "PARENT" },
    { username: "admin", password: "admin123", role: "ADMIN" },
    { username: "staff", password: "staff123", role: "STAFF" },
  ];

  // ---------------- LOGIN HANDLER ----------------
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    let user = dummyUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      user = registeredUsers.find(
        (u) => u.username === username && u.password === password
      );
    }

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    localStorage.setItem(
      "authUser",
      JSON.stringify({
        username: user.username,
        role: user.role,
      })
    );

    if (user.role === "PARENT") navigate("/parent");
    else if (user.role === "ADMIN") navigate("/admin");
    else if (user.role === "STAFF") navigate("/staff");
    else if (user.role === "AGENCY") navigate("/agency");
    else navigate("/");
  };

  // ---------------- FORGOT HANDLER ----------------
  const handleForgot = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    alert(`Reset instructions sent to ${email} (dummy)`);
    setShowForgot(false);
    setEmail("");
    setError("");
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
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                >
                  Forgot password?
                </button>
              </div>

              <button className="btn btn-primary w-100 mb-2">
                Login
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
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
