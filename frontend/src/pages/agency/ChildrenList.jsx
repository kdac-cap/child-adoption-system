import Navbar from "../../components/layout/Navbar";
import { childrenData } from "../../services/mockData";

function ChildrenList() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Children List</h2>

        {childrenData.map((child) => (
          <div className="card" key={child.id}>
            <h4>{child.name}</h4>
            <p>Age: {child.age}</p>
            <p>Gender: {child.gender}</p>
            <span className={`badge ${child.status}`}>
              {child.status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChildrenList;
