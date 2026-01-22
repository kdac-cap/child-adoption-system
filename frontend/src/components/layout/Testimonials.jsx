import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function Testimonials() {
  const location = useLocation();

  const defaultTestimonials = [
    {
      name: "Rohit Sharma",
      text:
        "The adoption process was smooth and transparent. Highly recommended!",
    },
    {
      name: "Neha Gupta",
      text:
        "We found our child through this system. The support was excellent.",
    },
    {
      name: "Arjun Mehta",
      text:
        "Professional staff and a user-friendly platform. Made everything easier.",
    },
    {
      name: "Sanya Kapoor",
      text:
        "Highly impressed with the guidance and process. Very thankful.",
    },
  ];

  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Load testimonials
  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("testimonials")) ||
      defaultTestimonials;

    setTestimonials(saved);
    localStorage.setItem("testimonials", JSON.stringify(saved));
  }, []);

  // Auto-open form when coming from Parent Dashboard
  useEffect(() => {
    if (location.state?.openForm) {
      setShowForm(true);
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !text) {
      toast.error("Please fill all fields");
      return;
    }

    const newTestimonial = { name, text };
    const updated = [newTestimonial, ...testimonials];

    setTestimonials(updated);
    localStorage.setItem("testimonials", JSON.stringify(updated));

    setName("");
    setText("");
    setShowForm(false);

    // ✅ SUCCESS TOAST
    toast.success("Your experience added successfully");
  };

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <div className="text-info text-center py-2 fw-bold fs-1">
        Parent Testimonials
      </div>

      <div className="container my-4">

        {/* ADD TESTIMONIAL BUTTON */}
        {!showForm && (
          <div className="text-center mb-4">
            <button
              className="btn btn-success"
              onClick={() => setShowForm(true)}
            >
              + Add Testimonial
            </button>
          </div>
        )}

        {/* ADD TESTIMONIAL FORM */}
        {showForm && (
          <div className="card mb-4 shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Share Your Adoption Experience</h5>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <textarea
                  className="form-control mb-3"
                  rows="3"
                  placeholder="Write your experience..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <div className="d-flex gap-2">
                  <button className="btn btn-success">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TESTIMONIAL LIST */}
        {testimonials.map((t, index) => (
          <div key={index} className="card mb-3 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">{t.name}</h5>
              <p className="card-text text-muted">
                "{t.text}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
