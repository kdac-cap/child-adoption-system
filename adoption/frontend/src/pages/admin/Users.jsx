import React, { useEffect, useState } from "react";
import { getData } from "../../utils/localStorageAPI";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getData("users") || []);
  }, []);

  return (
    <div>
      <h1 className="mb-4">Users</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
