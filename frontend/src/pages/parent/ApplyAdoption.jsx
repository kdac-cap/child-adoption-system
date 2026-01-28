import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { validateForm, validationRules } from "../../utils/validators";
import applicationService from "../../services/applicationService";

function ApplyAdoption() {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    experience: '',
    livingArrangement: '',
    financialStatus: '',
    references: ''
  });
  const [errors, setErrors] = useState({});

  if (!child) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="container">
            <div className="text-center py-5">
              <div className="dashboard-icon icon-danger mx-auto mb-3">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h4 className="text-muted mb-3">Child Information Not Found</h4>
              <p className="text-muted mb-4">
                Please go back and select a child to apply for adoption.
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/parent/children')}
                icon="arrow-left"
              >
                Back to Browse Children
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateApplication = () => {
    const rules = {
      reason: [{ validator: (v) => v && v.trim().length >= 50, message: "Please provide at least 50 characters explaining your reason" }],
      experience: [{ validator: (v) => v && v.trim() !== "", message: "Experience with children is required" }],
      livingArrangement: [{ validator: (v) => v && v.trim().length >= 30, message: "Please describe your living arrangement (minimum 30 characters)" }],
      financialStatus: [{ validator: (v) => v && v.trim() !== "", message: "Financial status information is required" }],
      references: [{ validator: (v) => v && v.trim().length >= 20, message: "Please provide reference information (minimum 20 characters)" }]
    };

    const validation = validateForm(formData, rules);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleApply = async () => {
    if (!validateApplication()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      const response = await applicationService.createApplication(child.id);
      
      toast.success('Application submitted successfully! Your application is under review.');
      navigate("/parent/applications");
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getChildImage = () => {
    if (child.photo) return `http://localhost:8080${child.photo}`;
    return child.gender === 'MALE' ? '/Boys.jpg' : '/girls.jpg';
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Header */}
              <div className="text-center mb-4 fade-in">
                <h2 className="text-gradient mb-3">
                  <i className="fas fa-heart me-2"></i>
                  Apply for Adoption
                </h2>
                <p className="lead text-muted">
                  Complete your application to adopt {child.name}
                </p>
              </div>

              <div className="card dashboard-card">
                {/* Child Information */}
                <div className="row mb-4">
                  <div className="col-md-4 text-center">
                    <img
                      src={getChildImage()}
                      alt={child.name}
                      className="img-fluid rounded shadow-custom"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = child.gender === 'MALE' ? '/Boys.jpg' : '/girls.jpg';
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="d-flex align-items-center mb-3">
                      <h4 className="text-primary mb-0 me-3">{child.name}</h4>
                      <div>
                        <span className="badge status-approved me-2">
                          <i className="fas fa-birthday-cake me-1"></i>
                          {child.age} years
                        </span>
                        <span className="badge status-matched">
                          <i className={`fas fa-${child.gender === 'Male' ? 'mars' : 'venus'} me-1`}></i>
                          {child.gender}
                        </span>
                      </div>
                    </div>

                    {child.description && (
                      <div className="mb-3">
                        <h6 className="text-muted fw-bold d-flex align-items-center">
                          <i className="fas fa-user me-2"></i>About {child.name}
                        </h6>
                        <p className="text-dark">{child.description}</p>
                      </div>
                    )}

                    {child.healthReport && (
                      <div className="mb-3">
                        <h6 className="text-muted fw-bold d-flex align-items-center">
                          <i className="fas fa-heartbeat me-2"></i>Health Status
                        </h6>
                        <p className="text-success">{child.healthReport}</p>
                      </div>
                    )}

                    {child.fosterHistory && (
                      <div className="mb-3">
                        <h6 className="text-muted fw-bold d-flex align-items-center">
                          <i className="fas fa-history me-2"></i>Background
                        </h6>
                        <p className="text-info">{child.fosterHistory}</p>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="my-4" />

                {/* Application Form */}
                <div className="mb-4">
                  <h5 className="text-primary mb-4">
                    <i className="fas fa-clipboard-list me-2"></i>
                    Application Details
                  </h5>

                  <div className="row">
                    <div className="col-12">
                      <Input
                        label="Why do you want to adopt this child?"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        error={errors.reason}
                        placeholder="Please explain your motivation and why you feel you'd be a good match..."
                        required
                        as="textarea"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <Input
                        label="Experience with Children"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        error={errors.experience}
                        placeholder="Describe your experience caring for children..."
                        required
                        as="textarea"
                        rows={3}
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        label="Financial Status"
                        name="financialStatus"
                        value={formData.financialStatus}
                        onChange={handleInputChange}
                        error={errors.financialStatus}
                        placeholder="Describe your financial stability and ability to provide..."
                        required
                        as="textarea"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <Input
                        label="Living Arrangement"
                        name="livingArrangement"
                        value={formData.livingArrangement}
                        onChange={handleInputChange}
                        error={errors.livingArrangement}
                        placeholder="Describe your home environment, space, and living situation..."
                        required
                        as="textarea"
                        rows={3}
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        label="References"
                        name="references"
                        value={formData.references}
                        onChange={handleInputChange}
                        error={errors.references}
                        placeholder="Provide contact information for 2-3 references..."
                        required
                        as="textarea"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Process Information */}
                <div className="alert alert-info mb-4">
                  <h6 className="d-flex align-items-center mb-3">
                    <i className="fas fa-info-circle me-2"></i>
                    Application Process
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <ol className="mb-0">
                        <li>Submit this application</li>
                        <li>Staff review and approval</li>
                        <li>Document submission request</li>
                      </ol>
                    </div>
                    <div className="col-md-6">
                      <ol className="mb-0" start="4">
                        <li>Admin document verification</li>
                        <li>Home visit and interview</li>
                        <li>Final approval and adoption</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center">
                  <Button
                    variant="success"
                    size="lg"
                    className="me-3"
                    onClick={handleApply}
                    loading={loading}
                    icon="heart"
                  >
                    Submit Application
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate("/parent/children")}
                    icon="arrow-left"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplyAdoption;
