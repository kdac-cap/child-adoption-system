import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <>
      <Navbar />
      {/* push content below fixed navbar */}
      <div style={{ paddingTop: "75px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default PublicLayout;
