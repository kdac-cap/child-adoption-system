function About() {
  const team = [
    {
      name: "Abhay",
      role: "Student",
      phone: "9966554433",
      img: "/Boys.jpg",
    },
    {
      name: "Pavan",
      role: "Student",
      phone: "9966554433",
      img: "/Boys.jpg",
    },
    {
      name: "Bhakti",
      role: "Student",
      phone: "9966554433",
      img: "/girls.jpg",
    },
    {
      name: "Akansha",
      role: "Student",
      phone: "9966554433",
      img: "/girls.jpg",
    },
  ];

  return (
    <div style={{ background: "#fff0f5", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="text-white text-center py-4 mb-4 fs-1"
        style={{ backgroundColor: "blue" }}
      >
      About us
      </div>

      {/* Cards */}
      <div className="container">
        <div className="row justify-content-center g-4 pb-5">
          {team.map((member, index) => (
            <div key={index} className="col-sm-6 col-md-4 col-lg-3">
              <div
                className="card text-center h-100 shadow-sm border-0"
                style={{ borderRadius: "10px", transition: "0.3s" }}
              >
                <div className="card-body">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="rounded-circle mb-3"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <h5 className="card-title mb-1">{member.name}</h5>
                  <p className="text-muted mb-1">{member.role}</p>
                  <p className="text-muted mb-0">
                    MobileNo: {member.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
