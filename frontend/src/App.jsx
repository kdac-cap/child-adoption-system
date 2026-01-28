import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./pages/admin/ThemeContext";

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
import DocumentReview from "./pages/staff/DocumentReview";

//Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/IntegratedAdminDashboard";
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
import PaymentSuccess from "./pages/donation/PaymentSuccess";
import DonationHistory from "./pages/donation/DonationHistory";
import ChildWelfareDashboard from "./pages/ChildWelfareDepartment/ChildWelfareDashboard";
import ResetPassword from "./pages/auth/ResetPassword";

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


<ThemeProvider>
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/donations" element={<DonationHistory />} />
        </Route>


        {/* ---------- AUTH ROUTES (no navbar if you want) ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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
        <Route
          path="/staff/documents"
          element={
            <ProtectedRoute allowedRoles={["STAFF", "SOCIAL_WORKER"]}>
              <DocumentReview />
            </ProtectedRoute>
          }
        />



        {/* ---------- CHILD WELFARE ROUTES ---------- */}
        <Route
          path="/child-welfare"
          element={
            <ProtectedRoute allowedRoles={["CHILD_WELFARE"]}>
              <ChildWelfareDashboard />
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
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "AGENCY",
                "PARENT",
                "STAFF",
                "CHILD_WELFARE",
              ]}
            >
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "AGENCY",
                "PARENT",
                "STAFF",
                "CHILD_WELFARE",
              ]}
            >
              <Chat />
            </ProtectedRoute>
          }
        />


        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
