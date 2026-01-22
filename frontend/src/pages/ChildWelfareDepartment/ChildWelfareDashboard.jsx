import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";

function ChildWelfareDashboard() {
  const [adoptions, setAdoptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [visitDate, setVisitDate] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  // ✅ LOAD ONLY VALID ADOPTIONS (REMOVE DUMMY ROWS)
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("adoptions")) || [];

    const validAdoptions = stored.filter(
      (a) => a.childName && a.parentUsername
    );

    setAdoptions(validAdoptions);
  }, []);

  const saveVisit = () => {
    if (!selected || !selected.parentUsername) {
      alert("Parent information missing");
      return;
    }

    const updated = adoptions.map((a) =>
      a.id === selected.id
        ? {
            ...a,
            visitDate,
            visitStatus: status,
            remarks,
          }
        : a
    );

    localStorage.setItem("adoptions", JSON.stringify(updated));
    setAdoptions(updated);

    const key = `parentNotifications_${selected.parentUsername}`;
    const notes = JSON.parse(localStorage.getItem(key)) || [];

    notes.push({
      id: Date.now(),
      message: `📅 Visit scheduled on ${visitDate} for ${selected.childName}`,
      read: false,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(key, JSON.stringify(notes));
    window.dispatchEvent(new Event("storage"));

    setSelected(null);
    setVisitDate("");
    setStatus("");
    setRemarks("");

    alert("Visit scheduled & parent notified");
  };

  // ✅ REMOVE VISIT (IMMEDIATE TABLE UPDATE)
  const removeVisit = (adoption) => {
    const updated = adoptions.map((a) =>
      a.id === adoption.id
        ? {
            ...a,
            visitDate: null,
            visitStatus: null,
            remarks: null,
          }
        : a
    );

    localStorage.setItem("adoptions", JSON.stringify(updated));
    setAdoptions(updated);

    if (selected?.id === adoption.id) {
      setSelected(null);
      setVisitDate("");
      setStatus("");
      setRemarks("");
    }

    const key = `parentNotifications_${adoption.parentUsername}`;
    const notes = JSON.parse(localStorage.getItem(key)) || [];

    notes.push({
      id: Date.now(),
      message: `❌ Visit cancelled for ${adoption.childName}`,
      read: false,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(key, JSON.stringify(notes));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <Navbar />
      <div className="container parent-dashboard-container">
        <h3 className="text-center parent-dashboard-title">
          Child Welfare Department Dashboard
        </h3>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Child</th>
              <th>Parent</th>
              <th>Visit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {adoptions.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No adoption records available
                </td>
              </tr>
            ) : (
              adoptions.map((a) => (
                <tr key={a.id}>
                  <td>{a.childName}</td>
                  <td>{a.parentUsername}</td>
                  <td>{a.visitDate || "Not Scheduled"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => setSelected(a)}
                    >
                      Schedule Visit
                    </button>

                    {a.visitDate && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeVisit(a)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selected && (
          <div className="card p-3 mt-3">
            <h5>Schedule Visit</h5>

            <input
              type="date"
              className="form-control mb-2"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />

            <select
              className="form-select mb-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="WELL_CARED">Well Cared</option>
              <option value="NEEDS_ATTENTION">
                Needs Attention
              </option>
            </select>

            <textarea
              className="form-control mb-2"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button
              className="btn btn-success"
              onClick={saveVisit}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ChildWelfareDashboard;
