function Testimonials() {
  const testimonials = [
    {
      name: "Rohit Sharma",
      text: "The adoption process was smooth and transparent. Highly recommended!",
    },
    {
      name: "Neha Gupta",
      text: "We found our child through this system. The support was excellent.",
    },
    {
      name: "Arjun Mehta",
      text: "Professional staff and a user-friendly platform. Made everything easier.",
    },
    {
      name: "Sanya Kapoor",
      text: "Highly impressed with the guidance and process. Very thankful.",
    },
  ];

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <div className="bg-primary text-white text-center py-4 fw-bold fs-1">
      Parent Testimonials
      </div>

      {/* Testimonials */}
      <div className="container my-4">
        {testimonials.map((t, index) => (
          <div key={index} className="card mb-3 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">{t.name}</h5>
              <p className="card-text text-muted">"{t.text}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
