import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ---------- LANDING ----------
import LandingPage from "./pages/LandingPage";

// ---------- AUTH ----------
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ---------- PARENT ----------
import ParentDashboard from "./pages/parent/ParentDashboard";
import BrowseChildren from "./pages/parent/BrowseChildren";
import ApplyAdoption from "./pages/parent/ApplyAdoption";
import MyApplications from "./pages/parent/MyApplications";
import Documents from "./pages/parent/Documents";

// ---------- STAFF ----------
import StaffDashboard from "./pages/staff/StaffDashboard";
import MyTasks from "./pages/staff/MyTasks";
import StaffApplications from "./pages/staff/StaffApplications";
import AddChild from "./pages/staff/AddChild";

// ---------- AGENCY ----------
import AgencyDashboard from "./pages/agency/AgencyDashboard";
import ChildrenList from "./pages/agency/ChildrenList";
import Applications from "./pages/agency/Applications";

//Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from  "./pages/admin/AdminDashboard";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Children from "./pages/admin/Children";
import AdoptionRequests from "./pages/admin/AdoptionRequests";
import Settings from "./pages/admin/Settings";
import Agency from "./pages/admin/Agency";
// ---------- COMMON ----------
import Notifications from "./pages/common/Notifications";
import Chat from "./pages/common/Chat";
import About from "./components/layout/About";
import Testimonials from "./components/layout/Testimonials";
import Donate from "./components/layout/Donate";
import PublicLayout from "./components/layout/PageLayout";

/* ==================================================
   PROTECTED ROUTE
================================================== */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ==================================================
   APP
================================================== */
function App() {
  return (

    

    <BrowserRouter>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
       {/* ---------- PUBLIC ROUTES WITH NAVBAR ---------- */}
  {/* ✅ LANDING — keep as is */}
      <Route element={<PublicLayout />}>
  <Route path="/" element={<LandingPage />} />
  <Route path="/about" element={<About />} />
  <Route path="/testimonials" element={<Testimonials />} />
  <Route path="/donate" element={<Donate />} />
    </Route>


        {/* ---------- AUTH ROUTES (no navbar if you want) ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- PARENT ROUTES ---------- */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/children"
          element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <BrowseChildren />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/apply/:childId"
          element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <ApplyAdoption />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/applications"
          element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/documents"
          element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <Documents />
            </ProtectedRoute>
          }
        />

        {/* ---------- STAFF ROUTES ---------- */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["STAFF", "SOCIAL_WORKER"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tasks"
          element={
            <ProtectedRoute allowedRoles={["STAFF", "SOCIAL_WORKER"]}>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/applications"
          element={
            <ProtectedRoute allowedRoles={["STAFF", "SOCIAL_WORKER"]}>
              <StaffApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/children"
          element={
            <ProtectedRoute allowedRoles={["STAFF", "SOCIAL_WORKER"]}>
              <AddChild />
            </ProtectedRoute>
          }
        />

        {/* ---------- AGENCY ROUTES ---------- */}
        <Route
          path="/agency"
          element={
            <ProtectedRoute allowedRoles={["AGENCY"]}>
              <AgencyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency/children"
          element={
            <ProtectedRoute allowedRoles={["AGENCY"]}>
              <ChildrenList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency/applications"
          element={
            <ProtectedRoute allowedRoles={["AGENCY"]}>
              <Applications />
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN ROUTES (NESTED) ---------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="children" element={<Children />} />
          <Route path="requests" element={<AdoptionRequests />} />
          <Route path="settings" element={<Settings />} />
          <Route path="agencies" element={<Agency />} />
          
          {/* <Route path="documents" element={<AdminDocuments />} /> */}
          {/* <Route path="portal" element={<AdminPortal />} /> */}
        </Route>

        {/* ---------- COMMON ROUTES ---------- */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENCY", "PARENT", "STAFF"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENCY", "PARENT", "STAFF"]}>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
