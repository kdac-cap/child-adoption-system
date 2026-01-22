import Navbar from "../../components/layout/Navbar";
import { applicationsData } from "../../services/mockData";

function Applications() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Adoption Applications</h2>

        {applicationsData.map((app) => (
          <div className="card" key={app.id}>
            <p><b>Parent:</b> {app.parentName}</p>
            <p><b>Child:</b> {app.childName}</p>
            <span className={`badge ${app.status}`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Applications;
