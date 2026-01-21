import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";

function AddChild() {
  const [childData, setChildData] = useState({
    name: "",
    age: "",
    gender: "",
    photo: "",
    healthReport: "",
    fosterHistory: "",
    description: "",
    status: "AVAILABLE"
  });
  const [children, setChildren] = useState([]);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = () => {
    const savedChildren = JSON.parse(localStorage.getItem("childrenData")) || [];
    setChildren(savedChildren);
  };

  const handleChange = (e) => {
    setChildData({
      ...childData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate photo upload with placeholder
      const photoUrl = `https://via.placeholder.com/200x200/${getRandomColor()}/white?text=${childData.name || 'Child'}`;
      setChildData({
        ...childData,
        photo: photoUrl
      });
    }
  };

  const getRandomColor = () => {
    const colors = ['4CAF50', 'FF9800', '2196F3', 'E91E63', '9C27B0', 'FF5722'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!childData.name || !childData.age || !childData.gender) {
      alert("Please fill in all required fields");
      return;
    }

    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const newChild = {
      ...childData,
      id: Date.now(),
      addedBy: authUser.username,
      addedAt: new Date().toISOString(),
      photo: childData.photo || `https://via.placeholder.com/200x200/${getRandomColor()}/white?text=${childData.name}`
    };

    const updatedChildren = [...children, newChild];
    localStorage.setItem("childrenData", JSON.stringify(updatedChildren));
    
    alert("Child added successfully!");
    setChildData({
      name: "",
      age: "",
      gender: "",
      photo: "",
      healthReport: "",
      fosterHistory: "",
      description: "",
      status: "AVAILABLE"
    });
    loadChildren();
  };

  const handleRemoveChild = (childId) => {
    if (window.confirm("Are you sure you want to remove this child?")) {
      const updatedChildren = children.filter(child => child.id !== childId);
      localStorage.setItem("childrenData", JSON.stringify(updatedChildren));
      loadChildren();
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3 className="text-center mb-4">👶 Manage Children</h3>

        <div className="row">
          {/* Add Child Form */}
          <div className="col-lg-4">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Add New Child</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={childData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Age *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      value={childData.age}
                      onChange={handleChange}
                      min="0"
                      max="18"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Gender *</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={childData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={childData.description}
                      onChange={handleChange}
                      rows="2"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Health Report</label>
                    <textarea
                      className="form-control"
                      name="healthReport"
                      value={childData.healthReport}
                      onChange={handleChange}
                      rows="2"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Foster History</label>
                    <textarea
                      className="form-control"
                      name="fosterHistory"
                      value={childData.fosterHistory}
                      onChange={handleChange}
                      rows="2"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Add Child
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Children List */}
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Children List ({children.length})</h5>
              </div>
              <div className="card-body">
                {children.length === 0 ? (
                  <p className="text-center text-muted">No children added yet</p>
                ) : (
                  <div className="row">
                    {children.map((child) => (
                      <div key={child.id} className="col-md-6 mb-3">
                        <div className="card border">
                          <img 
                            src={child.photo} 
                            className="card-img-top" 
                            alt={child.name}
                            style={{ height: "150px", objectFit: "cover" }}
                          />
                          <div className="card-body p-3">
                            <h6 className="card-title">{child.name}</h6>
                            <div className="mb-2">
                              <span className="badge bg-info me-1">Age: {child.age}</span>
                              <span className="badge bg-warning">{child.gender}</span>
                            </div>
                            <p className="card-text small">{child.description}</p>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveChild(child.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddChild;