function About() {
  return (
    <div style={{ background: "#fff0f5", minHeight: "100vh" }}>
      {/* Header */}
      <div className="text-info text-center py-4 mb-4">
        <h1 className="display-4 fw-bold">About Hope Adoption Center</h1>
        <p className="lead text-muted">Connecting families with love since 2010</p>
      </div>

      <div className="container">
        {/* Mission Section */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px" }}>
              <div className="card-body p-4">
                <h3 className="text-primary mb-3">Our Mission</h3>
                <p className="text-muted mb-0">
                  We are dedicated to providing loving, permanent homes for children in need. 
                  Our comprehensive adoption services ensure that every child finds a safe, 
                  nurturing environment where they can thrive and grow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="row mb-5">
          <div className="col-md-3 col-6 text-center mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="text-success fw-bold">500+</h2>
                <p className="text-muted mb-0">Children Placed</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 text-center mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="text-info fw-bold">300+</h2>
                <p className="text-muted mb-0">Happy Families</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 text-center mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="text-warning fw-bold">15+</h2>
                <p className="text-muted mb-0">Years Experience</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 text-center mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="text-danger fw-bold">24/7</h2>
                <p className="text-muted mb-0">Support Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="row mb-5">
          <div className="col-lg-10 mx-auto">
            <h3 className="text-center text-primary mb-4">Our Services</h3>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-heart text-danger mb-3" style={{ fontSize: '2rem' }}></i>
                    <h5>Child Placement</h5>
                    <p className="text-muted small">Matching children with loving families</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-users text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                    <h5>Family Support</h5>
                    <p className="text-muted small">Counseling and guidance throughout the process</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-file-alt text-success mb-3" style={{ fontSize: '2rem' }}></i>
                    <h5>Legal Assistance</h5>
                    <p className="text-muted small">Complete documentation and legal support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px" }}>
              <div className="card-body p-4 text-center">
                <h4 className="text-primary mb-3">Get In Touch</h4>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <i className="fas fa-phone text-success me-2"></i>
                    <span>+91 9876543210</span>
                  </div>
                  <div className="col-md-4 mb-2">
                    <i className="fas fa-envelope text-info me-2"></i>
                    <span>info@hopeadoption.org</span>
                  </div>
                  <div className="col-md-4 mb-2">
                    <i className="fas fa-map-marker-alt text-danger me-2"></i>
                    <span>Mumbai, Maharashtra</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="row mb-5">
          <div className="col-lg-10 mx-auto">
            <h3 className="text-center text-primary mb-4">Our Team</h3>
            <div className="row justify-content-center">
              <div className="col-sm-6 col-md-3 mb-3">
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body">
                    <img src="/Abhay.png" alt="Abhay" className="rounded-circle mb-3" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                    <h6 className="fw-bold">Abhay</h6>
                    <p className="text-muted small mb-1">Developer</p>
                    <p className="text-muted small">9966554433</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-3 mb-3">
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body">
                    <img src="/Pavan.jpeg" alt="Pavan" className="rounded-circle mb-3" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                    <h6 className="fw-bold">Pavan</h6>
                    <p className="text-muted small mb-1">Developer</p>
                    <p className="text-muted small">9966554433</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-3 mb-3">
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body">
                    <img src="/Bhakti.jpg" alt="Bhakti" className="rounded-circle mb-3" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                    <h6 className="fw-bold">Bhakti</h6>
                    <p className="text-muted small mb-1">Developer</p>
                    <p className="text-muted small">9966554433</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-3 mb-3">
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body">
                    <img src="/Akanksha.png" alt="Akansha" className="rounded-circle mb-3" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                    <h6 className="fw-bold">Akansha</h6>
                    <p className="text-muted small mb-1">Developer</p>
                    <p className="text-muted small">9966554433</p>
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

export default About;
