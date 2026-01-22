import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";

/* ---------------------------------
   INITIAL TASKS (MOCK DATA)
--------------------------------- */
const initialTasks = [
  {
    task_id: 1,
    title: "Verify Parent Documents",
    description: "Check income & ID proofs",
    status: "OPEN",
    priority: "HIGH",
    due_date: "2025-01-10",
  },
  {
    task_id: 2,
    title: "Home Study Visit",
    description: "Conduct home visit",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    due_date: "2025-01-15",
  },
];

function MyTasks() {
  const [tasks, setTasks] = useState([]);

  /* ---------------------------------
     LOAD TASKS FROM STORAGE
  --------------------------------- */
  useEffect(() => {
    const storedTasks =
      JSON.parse(localStorage.getItem("staffTasks")) || initialTasks;

    localStorage.setItem("staffTasks", JSON.stringify(storedTasks));
    setTasks(storedTasks);
  }, []);

  /* ---------------------------------
     UPDATE TASK STATUS
  --------------------------------- */
  const updateStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.task_id === taskId
        ? { ...task, status: newStatus }
        : task
    );

    setTasks(updatedTasks);
    localStorage.setItem("staffTasks", JSON.stringify(updatedTasks));
  };

  return (
    <>
      <Navbar />
      <div className="parent-dashboard-container">
        <h2 className="text-center parent-dashboard-title">My Tasks</h2>

        {tasks.map((task) => (
          <div
            key={task.task_id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><b>Title:</b> {task.title}</p>
            <p><b>Description:</b> {task.description}</p>
            <p><b>Priority:</b> {task.priority}</p>
            <p><b>Due Date:</b> {task.due_date}</p>
            <p><b>Status:</b> {task.status}</p>

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus(task.task_id, e.target.value)
              }
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyTasks;
