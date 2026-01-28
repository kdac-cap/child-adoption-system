import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from "../../components/layout/Navbar";
import childService from "../../services/childService";

function AddChild() {
  const [childData, setChildData] = useState({
    name: "",
    age: "",
    gender: "",
    photo: null,
    healthReport: "",
    fosterHistory: "",
    description: ""
  });

  const [children, setChildren] = useState([]);
  const [editingChildId, setEditingChildId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      // Staff should use /staff/children endpoint to get all children they manage
      const response = await axios.get('http://localhost:8080/staff/children', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setChildren(response.data);
    } catch (error) {
      console.error('Error loading children:', error);
      toast.error('Failed to load children');
    }
  };

  const handleChange = (e) => {
    setChildData({
      ...childData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditChild = (child) => {
    setChildData({
      name: child.name,
      age: child.age,
      gender: child.gender,
      photo: null,
      healthReport: child.healthReport || "",
      fosterHistory: child.fosterHistory || "",
      description: child.description || ""
    });
    setEditingChildId(child.id);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChildData({
        ...childData,
        photo: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!childData.name || !childData.age || !childData.gender) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        name: childData.name,
        age: parseInt(childData.age),
        gender: childData.gender.toUpperCase(),
        description: childData.description,
        healthReport: childData.healthReport,
        fosterHistory: childData.fosterHistory,
        photo: childData.photo
      };

      if (editingChildId) {
        await childService.updateChild(editingChildId, formData);
        toast.success("Child updated successfully!");
      } else {
        await childService.addChild(formData);
        toast.success("Child added successfully!");
      }

      await loadChildren();

      setChildData({
        name: "",
        age: "",
        gender: "",
        photo: null,
        healthReport: "",
        fosterHistory: "",
        description: ""
      });

      setEditingChildId(null);
    } catch (error) {
      console.error('Error saving child:', error);
      toast.error(error.message || 'Failed to save child');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveChild = async (childId) => {
    if (window.confirm("Are you sure you want to remove this child?")) {
      try {
        await childService.deleteChild(childId);
        toast.success('Child removed successfully');
        await loadChildren();
      } catch (error) {
        console.error('Error removing child:', error);
        toast.error('Failed to remove child');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container parent-dashboard-container">
        <h3 className="text-center parent-dashboard-title">
          👶 Manage Children
        </h3>

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
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
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

                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Saving..." : editingChildId ? "Update Child" : "Add Child"}
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
                  <p className="text-center text-muted">
                    No children added yet
                  </p>
                ) : (
                  <div className="row">
                    {children.map((child) => (
                      <div key={child.id} className="col-md-6 mb-3">
                        <div className="card border">
                          <img
                            src={child.photo ? `http://localhost:8080${child.photo}` : (child.gender === 'MALE' ? '/Boys.jpg' : '/girls.jpg')}
                            alt={child.name}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              objectPosition: "center",
                              borderTopLeftRadius: "6px",
                              borderTopRightRadius: "6px"
                            }}
                            onError={(e) => {
                              e.target.src = child.gender === 'MALE' ? '/Boys.jpg' : '/girls.jpg';
                            }}
                          />

                          <div className="card-body p-3">
                            <h6 className="card-title">{child.name}</h6>
                            <div className="mb-2">
                              <span className="badge bg-info me-1">
                                Age: {child.age}
                              </span>
                              <span className="badge bg-warning">
                                {child.gender === 'MALE' ? 'Male' : 'Female'}
                              </span>
                            </div>
                            <p className="card-text small">
                              {child.description}
                            </p>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleEditChild(child)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleRemoveChild(child.id)
                                }
                              >
                                Remove
                              </button>
                            </div>
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
