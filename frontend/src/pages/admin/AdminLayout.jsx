import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar - hidden on mobile, fixed on desktop */}
      <div className="d-none d-lg-block position-sticky top-0" style={{ height: "100vh", zIndex: 1000 }}>
        <Sidebar isMobile={false} />
      </div>

      {/* Mobile Sidebar - shown only on mobile */}
      <div className="d-lg-none position-fixed top-0 start-0" style={{ height: "100vh", zIndex: 1000 }}>
        <Sidebar isMobile={true} />
      </div>

      {/* Main content with overflow */}
      <div className="flex-grow-1" style={{ overflowY: "auto", height: "100vh" }}>
        <div className="p-2 p-sm-3 p-md-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {};

export default AdminLayout;
