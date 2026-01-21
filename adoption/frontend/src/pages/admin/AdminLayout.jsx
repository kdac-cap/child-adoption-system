import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="d-flex">
      {/* Sidebar sticky */}
      <div className="sticky-top" style={{ height: "100vh" }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
