import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (!formData.username || !formData.password) {
      setError("Username and Password are required");
      return;
    }

    const users =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    users.push({
      role,
      ...formData,
    });

    localStorage.setItem("registeredUsers", JSON.stringify(users));

    alert("Registration successful! Please login.");
    navigate("/");
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "#FFF9C4" }}
    >
      <div className="card shadow-lg p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-3">Register</h3>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        {/* ROLE SELECTION */}
        <div className="mb-3">
          <label className="form-label">Register As</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setFormData({});
            }}
          >
            <option value="">Select Role</option>
            <option value="PARENT">Parent</option>
            <option value="AGENCY">Agency</option>
            <option value="STAFF">Staff</option>

            {/* ✅ CHILD WELFARE ROLE */}
            <option value="CHILD_WELFARE">
              Child Welfare Department
            </option>
          </select>
        </div>

        {role && (
          <form onSubmit={handleSubmit}>
            {/* COMMON FIELDS */}
            <input
              className="form-control mb-2"
              placeholder="Full Name"
              name="full_name"
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />

            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              placeholder="Phone"
              name="phone"
              onChange={handleChange}
            />

            {/* PARENT FIELDS */}
            {role === "PARENT" && (
              <>
                <select
                  className="form-select mb-2"
                  name="marital_status"
                  onChange={handleChange}
                >
                  <option value="">Marital Status</option>
                  <option>Single</option>
                  <option>Married</option>
                </select>

                <input
                  className="form-control mb-2"
                  placeholder="Occupation"
                  name="occupation"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Annual Income"
                  name="annual_income"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="City"
                  name="city"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="State"
                  name="state"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Pincode"
                  name="postal_code"
                  onChange={handleChange}
                />
              </>
            )}

            {/* AGENCY FIELDS */}
            {role === "AGENCY" && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Agency Name"
                  name="agency_name"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="License Number"
                  name="license_number"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Office Address"
                  name="address"
                  onChange={handleChange}
                />
              </>
            )}

            {/* STAFF FIELDS */}
            {role === "STAFF" && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Agency Name"
                  name="agency_name"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Agency License Number"
                  name="agency_license"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Designation"
                  name="designation"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Qualification"
                  name="qualification"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Experience (years)"
                  name="experience"
                  onChange={handleChange}
                />
              </>
            )}

            {/* CHILD WELFARE FIELDS */}
            {role === "CHILD_WELFARE" && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Department Name"
                  name="department_name"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Employee ID"
                  name="employee_id"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Office Location"
                  name="office_location"
                  onChange={handleChange}
                />
              </>
            )}

            <button className="btn btn-warning w-100 mt-2">
              Register
            </button>
          </form>
        )}

        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
