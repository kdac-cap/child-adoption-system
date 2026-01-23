import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { validateForm, validationRules } from "../../utils/validators";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: "PARENT", label: "Prospective Parent" },
    { value: "AGENCY", label: "Adoption Agency" },
    { value: "STAFF", label: "Staff Member" },
    { value: "CHILD_WELFARE", label: "Child Welfare Department" }
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({});
    setErrors({});
  };

  const getValidationRules = () => {
    const baseRules = {
      full_name: validationRules.name,
      username: [{ validator: (v) => v && v.trim() !== "", message: "Username is required" }],
      password: validationRules.password,
      email: validationRules.email,
      phone: validationRules.phone
    };

    if (role === "PARENT") {
      return {
        ...baseRules,
        marital_status: [{ validator: (v) => v && v.trim() !== "", message: "Marital status is required" }],
        occupation: [{ validator: (v) => v && v.trim() !== "", message: "Occupation is required" }],
        annual_income: validationRules.income,
        city: [{ validator: (v) => v && v.trim() !== "", message: "City is required" }],
        state: [{ validator: (v) => v && v.trim() !== "", message: "State is required" }],
        postal_code: [{ validator: (v) => /^\d{6}$/.test(v), message: "Please enter a valid 6-digit pincode" }]
      };
    }

    if (role === "AGENCY") {
      return {
        ...baseRules,
        agency_name: [{ validator: (v) => v && v.trim() !== "", message: "Agency name is required" }],
        license_number: [{ validator: (v) => v && v.trim() !== "", message: "License number is required" }],
        address: validationRules.address
      };
    }

    if (role === "STAFF") {
      return {
        ...baseRules,
        agency_name: [{ validator: (v) => v && v.trim() !== "", message: "Agency name is required" }],
        designation: [{ validator: (v) => v && v.trim() !== "", message: "Designation is required" }],
        qualification: [{ validator: (v) => v && v.trim() !== "", message: "Qualification is required" }],
        experience: [{ validator: (v) => !isNaN(v) && v >= 0, message: "Please enter valid experience in years" }]
      };
    }

    if (role === "CHILD_WELFARE") {
      return {
        ...baseRules,
        department_name: [{ validator: (v) => v && v.trim() !== "", message: "Department name is required" }],
        employee_id: [{ validator: (v) => v && v.trim() !== "", message: "Employee ID is required" }],
        office_location: [{ validator: (v) => v && v.trim() !== "", message: "Office location is required" }]
      };
    }

    return baseRules;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!role) {
      setErrors({ role: "Please select a role" });
      return;
    }

    const validation = validateForm(formData, getValidationRules());
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      
      // Check if username already exists
      const existingUser = users.find(u => u.username === formData.username);
      if (existingUser) {
        setErrors({ username: "Username already exists" });
        setLoading(false);
        return;
      }

      users.push({
        role,
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("registeredUsers", JSON.stringify(users));
      
      toast.success("Registration successful! Please login with your credentials.");
      navigate("/login");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-gradient-primary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="dashboard-icon icon-success mx-auto mb-3">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <h3 className="text-gradient mb-2">Join Our Community</h3>
                  <p className="text-muted">Create your account to start the adoption journey</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <Select
                    label="Register As"
                    value={role}
                    onChange={handleRoleChange}
                    options={roleOptions}
                    error={errors.role}
                    placeholder="Select your role"
                    required
                  />

                  {role && (
                    <div className="fade-in">
                      <div className="row">
                        <div className="col-md-6">
                          <Input
                            label="Full Name"
                            name="full_name"
                            value={formData.full_name || ''}
                            onChange={handleChange}
                            error={errors.full_name}
                            placeholder="Enter your full name"
                            icon="user"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <Input
                            label="Username"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            error={errors.username}
                            placeholder="Choose a username"
                            icon="at"
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Create a strong password"
                            icon="lock"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="Enter your email"
                            icon="envelope"
                            required
                          />
                        </div>
                      </div>

                      <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="Enter your phone number"
                        icon="phone"
                        required
                      />

                      {/* Role-specific fields */}
                      {role === "PARENT" && (
                        <div className="border-top pt-3 mt-3">
                          <h6 className="text-muted mb-3">Parent Information</h6>
                          <div className="row">
                            <div className="col-md-6">
                              <Select
                                label="Marital Status"
                                name="marital_status"
                                value={formData.marital_status || ''}
                                onChange={handleChange}
                                options={maritalStatusOptions}
                                error={errors.marital_status}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                label="Occupation"
                                name="occupation"
                                value={formData.occupation || ''}
                                onChange={handleChange}
                                error={errors.occupation}
                                placeholder="Your occupation"
                                icon="briefcase"
                                required
                              />
                            </div>
                          </div>
                          <Input
                            label="Annual Income"
                            name="annual_income"
                            type="number"
                            value={formData.annual_income || ''}
                            onChange={handleChange}
                            error={errors.annual_income}
                            placeholder="Annual income in rupees"
                            icon="rupee-sign"
                            required
                          />
                          <div className="row">
                            <div className="col-md-4">
                              <Input
                                label="City"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleChange}
                                error={errors.city}
                                placeholder="City"
                                icon="map-marker-alt"
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <Input
                                label="State"
                                name="state"
                                value={formData.state || ''}
                                onChange={handleChange}
                                error={errors.state}
                                placeholder="State"
                                icon="map"
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <Input
                                label="Pincode"
                                name="postal_code"
                                value={formData.postal_code || ''}
                                onChange={handleChange}
                                error={errors.postal_code}
                                placeholder="6-digit pincode"
                                icon="mail-bulk"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {role === "AGENCY" && (
                        <div className="border-top pt-3 mt-3">
                          <h6 className="text-muted mb-3">Agency Information</h6>
                          <Input
                            label="Agency Name"
                            name="agency_name"
                            value={formData.agency_name || ''}
                            onChange={handleChange}
                            error={errors.agency_name}
                            placeholder="Official agency name"
                            icon="building"
                            required
                          />
                          <Input
                            label="License Number"
                            name="license_number"
                            value={formData.license_number || ''}
                            onChange={handleChange}
                            error={errors.license_number}
                            placeholder="Government license number"
                            icon="certificate"
                            required
                          />
                          <Input
                            label="Office Address"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            error={errors.address}
                            placeholder="Complete office address"
                            icon="map-marker-alt"
                            required
                          />
                        </div>
                      )}

                      {role === "STAFF" && (
                        <div className="border-top pt-3 mt-3">
                          <h6 className="text-muted mb-3">Staff Information</h6>
                          <Input
                            label="Agency Name"
                            name="agency_name"
                            value={formData.agency_name || ''}
                            onChange={handleChange}
                            error={errors.agency_name}
                            placeholder="Agency you work for"
                            icon="building"
                            required
                          />
                          <div className="row">
                            <div className="col-md-6">
                              <Input
                                label="Designation"
                                name="designation"
                                value={formData.designation || ''}
                                onChange={handleChange}
                                error={errors.designation}
                                placeholder="Your job title"
                                icon="id-badge"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                label="Experience (Years)"
                                name="experience"
                                type="number"
                                value={formData.experience || ''}
                                onChange={handleChange}
                                error={errors.experience}
                                placeholder="Years of experience"
                                icon="clock"
                                required
                              />
                            </div>
                          </div>
                          <Input
                            label="Qualification"
                            name="qualification"
                            value={formData.qualification || ''}
                            onChange={handleChange}
                            error={errors.qualification}
                            placeholder="Educational qualification"
                            icon="graduation-cap"
                            required
                          />
                        </div>
                      )}

                      {role === "CHILD_WELFARE" && (
                        <div className="border-top pt-3 mt-3">
                          <h6 className="text-muted mb-3">Department Information</h6>
                          <Input
                            label="Department Name"
                            name="department_name"
                            value={formData.department_name || ''}
                            onChange={handleChange}
                            error={errors.department_name}
                            placeholder="Government department name"
                            icon="university"
                            required
                          />
                          <div className="row">
                            <div className="col-md-6">
                              <Input
                                label="Employee ID"
                                name="employee_id"
                                value={formData.employee_id || ''}
                                onChange={handleChange}
                                error={errors.employee_id}
                                placeholder="Government employee ID"
                                icon="id-card"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                label="Office Location"
                                name="office_location"
                                value={formData.office_location || ''}
                                onChange={handleChange}
                                error={errors.office_location}
                                placeholder="Office location"
                                icon="map-marker-alt"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <Button
                          type="submit"
                          variant="success"
                          className="w-100 mb-3"
                          loading={loading}
                          icon="user-plus"
                          size="lg"
                        >
                          Create Account
                        </Button>
                      </div>
                    </div>
                  )}
                </form>

                <div className="text-center mt-3">
                  <p className="mb-2 text-muted">Already have an account?</p>
                  <Link to="/login" className="btn btn-outline-primary">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login Here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
