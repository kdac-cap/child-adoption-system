import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #fceabb, #f8b500)",
          minHeight: "60vh",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-dark mb-4">
                Every Child Deserves a Loving Home
              </h1>
              <p className="lead text-dark mb-4">
                We connect children in need with families ready to provide love,
                care, and a bright future. Join us in making dreams come true.
              </p>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </button>
                <button className="btn btn-outline-dark btn-lg">
                  Learn More
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div
                className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: "300px", height: "300px" }}
              >
                <i className="fas fa-users text-primary" style={{ fontSize: "120px" }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-4">About Hope Adoption Center</h2>
              <p className="lead text-muted mb-5">
                For over 25 years, we have been dedicated to creating families
                through ethical adoption practices, comprehensive support, and
                unwavering commitment to child welfare.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: "80px", height: "80px" }}>
                    <i className="fas fa-shield-alt text-primary fs-2"></i>
                  </div>
                  <h5 className="card-title">Safe & Secure</h5>
                  <p className="card-text text-muted">
                    All our processes are thoroughly vetted and comply with
                    national adoption standards for child safety.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: "80px", height: "80px" }}>
                    <i className="fas fa-hands-helping text-success fs-2"></i>
                  </div>
                  <h5 className="card-title">Full Support</h5>
                  <p className="card-text text-muted">
                    From initial consultation to post-adoption care, we provide
                    comprehensive support throughout your journey.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: "80px", height: "80px" }}>
                    <i className="fas fa-heart text-warning fs-2"></i>
                  </div>
                  <h5 className="card-title">With Love</h5>
                  <p className="card-text text-muted">
                    Every placement is made with love, ensuring the best match
                    between children and their forever families.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="mb-3">
                <h3 className="display-4 fw-bold text-primary">500+</h3>
                <p className="text-muted">Successful Adoptions</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <h3 className="display-4 fw-bold text-success">25+</h3>
                <p className="text-muted">Years of Experience</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <h3 className="display-4 fw-bold text-warning">50+</h3>
                <p className="text-muted">Partner Agencies</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <h3 className="display-4 fw-bold text-info">24/7</h3>
                <p className="text-muted">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="lead mb-4">
            Join hundreds of families who have found their perfect match through
            our adoption services.
          </p>
          <button
            className="btn btn-light btn-lg me-3"
            onClick={() => navigate("/login")}
          >
            Login to Portal
          </button>
          <button
            className="btn btn-outline-light btn-lg"
            onClick={() => navigate("/register")}
          >
            Register Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Hope Adoption Center</h5>
              <p className="text-muted">
                Creating families, changing lives, one adoption at a time.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted mb-0">
                © 2024 Hope Adoption Center. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;