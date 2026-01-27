import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const generatedTasks = [];

    applications.forEach(app => {
      if (app.status === "PENDING_STAFF_APPROVAL") {
        generatedTasks.push({
          id: `review-${app.id}`,
          title: `Review Application #${app.id}`,
          description: `Review adoption application from ${app.parentName} for ${app.childName}`,
          priority: "HIGH",
          type: "REVIEW_APPLICATION",
          applicationId: app.id,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
        });
      }

      if (app.status === "DOCUMENTS_SUBMITTED") {
        generatedTasks.push({
          id: `verify-${app.id}`,
          title: `Verify Documents #${app.id}`,
          description: `Verify submitted documents for ${app.parentName}'s application`,
          priority: "HIGH",
          type: "VERIFY_DOCUMENTS",
          applicationId: app.id,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
        });
      }

      if (app.status === "DOCUMENTS_VERIFIED") {
        generatedTasks.push({
          id: `schedule-${app.id}`,
          title: `Schedule Welfare Visit #${app.id}`,
          description: `Schedule home visit for ${app.parentName}`,
          priority: "MEDIUM",
          type: "SCHEDULE_VISIT",
          applicationId: app.id,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
        });
      }
    });

    setTasks(generatedTasks);
  };

  const handleTaskAction = (task) => {
    if (task.type === "REVIEW_APPLICATION") {
      navigate("/staff/applications");
    } else if (task.type === "VERIFY_DOCUMENTS") {
      navigate("/staff/documents");
    } else if (task.type === "SCHEDULE_VISIT") {
      navigate("/staff/visits");
    }
  };

  const getPriorityColor = (priority) => {
    return priority === "HIGH" ? "danger" : priority === "MEDIUM" ? "warning" : "info";
  };

  return (
    <>
      <Navbar />
      <div className="container parent-dashboard-container">
        <h2 className="text-center parent-dashboard-title">📋 My Tasks</h2>

        <div className="row">
          {tasks.map((task) => (
            <div key={task.id} className="col-lg-6 mb-4">
              <div className="card shadow h-100">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{task.title}</h5>
                  <span className={`badge bg-${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-text">{task.description}</p>
                  <div className="mb-3">
                    <small className="text-muted">
                      <strong>Due:</strong> {task.dueDate}
                    </small>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleTaskAction(task)}
                  >
                    Take Action →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="alert alert-success text-center">
            <h5>🎉 All caught up!</h5>
            <p>You have no pending tasks at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default MyTasks;
