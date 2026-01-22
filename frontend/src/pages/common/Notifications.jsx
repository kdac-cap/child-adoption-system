import Navbar from "../../components/layout/Navbar";
import { notificationsData } from "../../services/mockData";

function Notifications() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Notifications</h2>

        {notificationsData.map((n) => (
          <div
            key={n.id}
            style={{
              padding: "10px",
              background: n.read ? "#eee" : "#d1e7ff",
              marginBottom: "8px",
            }}
          >
            {n.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default Notifications;
