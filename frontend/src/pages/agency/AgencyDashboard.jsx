import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function AgencyDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{ padding: "50px" }}>
        <h2>Agency Dashboard</h2>

        <button onClick={() => navigate("/agency/children")}>
          Manage Children
        </button>

        <br /><br />

        <button onClick={() => navigate("/agency/applications")}>
          View Applications
        </button>
      </div>
    </>
  );
}

export default AgencyDashboard;
