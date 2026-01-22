import React, { useEffect, useState } from "react";
import { getData } from "../../utils/localStorageAPI";

const Children = () => {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const data = getData("children") || [];
    setChildren(data);
  }, []);

  return (
    <div>
      <h1 className="mb-4">Children</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {children.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.age}</td>
              <td>{c.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Children;
