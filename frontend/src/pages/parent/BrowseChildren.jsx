import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";

function BrowseChildren() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [filters, setFilters] = useState({
    ageRange: '',
    gender: '',
    healthStatus: ''
  });
  const [loading, setLoading] = useState(true);

  const ageRangeOptions = [
    { value: '0-2', label: '0-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '11-15', label: '11-15 years' },
    { value: '16-18', label: '16-18 years' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  const healthStatusOptions = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Special Needs', label: 'Special Needs' }
  ];

  useEffect(() => {
    // Load children from localStorage
    const childrenData = JSON.parse(localStorage.getItem("childrenData")) || [];
    const availableChildren = childrenData.filter(child => child.status === "AVAILABLE");
    setChildren(availableChildren);
    setFilteredChildren(availableChildren);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = children;

    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
      filtered = filtered.filter(child => {
        const age = parseInt(child.age);
        return age >= minAge && age <= maxAge;
      });
    }

    if (filters.gender) {
      filtered = filtered.filter(child => child.gender === filters.gender);
    }

    if (filters.healthStatus) {
      filtered = filtered.filter(child => 
        child.healthReport && child.healthReport.includes(filters.healthStatus)
      );
    }

    setFilteredChildren(filtered);
  }, [filters, children]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ ageRange: '', gender: '', healthStatus: '' });
  };

  const getChildImage = (child) => {
    // Use provided photo or default based on gender
    if (child.photo) return child.photo;
    return child.gender === 'Male' ? '/Boys.jpg' : '/girls.jpg';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="container text-center">
            <div className="spinner"></div>
            <p className="mt-3 text-muted">Loading children...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5 fade-in">
            <h2 className="text-gradient mb-3">
              <i className="fas fa-heart me-2"></i>
              Children Available for Adoption
            </h2>
            <p className="lead text-muted">
              Find your perfect match and start your adoption journey
            </p>
          </div>

          {/* Filters */}
          <div className="card dashboard-card mb-4">
            <div className="row align-items-end">
              <div className="col-md-3">
                <Select
                  label="Age Range"
                  name="ageRange"
                  value={filters.ageRange}
                  onChange={handleFilterChange}
                  options={ageRangeOptions}
                  placeholder="All ages"
                />
              </div>
              <div className="col-md-3">
                <Select
                  label="Gender"
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  options={genderOptions}
                  placeholder="All genders"
                />
              </div>
              <div className="col-md-3">
                <Select
                  label="Health Status"
                  name="healthStatus"
                  value={filters.healthStatus}
                  onChange={handleFilterChange}
                  options={healthStatusOptions}
                  placeholder="All health statuses"
                />
              </div>
              <div className="col-md-3">
                <Button
                  variant="outline-secondary"
                  onClick={clearFilters}
                  className="w-100"
                  icon="times"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-muted">
              <i className="fas fa-search me-2"></i>
              Showing {filteredChildren.length} of {children.length} children
            </p>
          </div>

          {/* No Results */}
          {filteredChildren.length === 0 && (
            <div className="text-center py-5">
              <div className="dashboard-icon icon-info mx-auto mb-3">
                <i className="fas fa-search"></i>
              </div>
              <h4 className="text-muted mb-3">
                {children.length === 0 ? 'No children available' : 'No children match your filters'}
              </h4>
              <p className="text-muted mb-4">
                {children.length === 0 
                  ? 'Please check back later or contact our staff for more information.'
                  : 'Try adjusting your search criteria to see more results.'
                }
              </p>
              {children.length > 0 && (
                <Button variant="primary" onClick={clearFilters} icon="refresh">
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Children Grid */}
          <div className="row">
            {filteredChildren.map((child, index) => (
              <div key={child.id || index} className="col-lg-4 col-md-6 mb-4">
                <div className="card dashboard-card h-100">
                  <div className="position-relative">
                    <img 
                      src={getChildImage(child)}
                      className="card-img-top" 
                      alt={child.name}
                      style={{ height: "250px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = child.gender === 'Male' ? '/Boys.jpg' : '/girls.jpg';
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge status-available">
                        <i className="fas fa-heart me-1"></i>
                        Available
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <h4 className="text-primary fw-bold mb-2">{child.name}</h4>
                      <div className="d-flex justify-content-center gap-2 mb-3">
                        <span className="badge status-approved">
                          <i className="fas fa-birthday-cake me-1"></i>
                          {child.age} years
                        </span>
                        <span className="badge status-matched">
                          <i className={`fas fa-${child.gender === 'Male' ? 'mars' : 'venus'} me-1`}></i>
                          {child.gender}
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow-1">
                      {child.description && (
                        <div className="mb-3">
                          <h6 className="text-muted fw-bold d-flex align-items-center">
                            <i className="fas fa-user me-2"></i>About
                          </h6>
                          <p className="small text-dark">{child.description}</p>
                        </div>
                      )}

                      {child.healthReport && (
                        <div className="mb-3">
                          <h6 className="text-muted fw-bold d-flex align-items-center">
                            <i className="fas fa-heartbeat me-2"></i>Health Status
                          </h6>
                          <p className="small text-success">{child.healthReport}</p>
                        </div>
                      )}

                      {child.fosterHistory && (
                        <div className="mb-3">
                          <h6 className="text-muted fw-bold d-flex align-items-center">
                            <i className="fas fa-history me-2"></i>Background
                          </h6>
                          <p className="small text-info">{child.fosterHistory}</p>
                        </div>
                      )}

                      {child.addedBy && (
                        <div className="mb-3">
                          <small className="text-muted d-flex align-items-center">
                            <i className="fas fa-user-tie me-2"></i>
                            Managed by: {child.addedBy}
                          </small>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
                      <Button
                        variant="primary"
                        className="w-100"
                        icon="heart"
                        onClick={() =>
                          navigate(`/parent/apply/${child.id}`, {
                            state: child,
                          })
                        }
                      >
                        Apply for Adoption
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          {filteredChildren.length > 0 && (
            <div className="text-center mt-5">
              <div className="card dashboard-card">
                <h5 className="mb-3">Need Help Choosing?</h5>
                <p className="text-muted mb-4">
                  Our experienced counselors can help you find the perfect match for your family.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button 
                    variant="outline-primary"
                    onClick={() => navigate('/chat')}
                    icon="comments"
                  >
                    Chat with Counselor
                  </Button>
                  <Button 
                    variant="outline-success"
                    onClick={() => navigate('/about')}
                    icon="info-circle"
                  >
                    Learn About Process
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BrowseChildren;
