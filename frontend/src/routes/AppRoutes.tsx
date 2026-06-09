import Login from "../pages/Login";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import DepartmentLayout from "../layouts/DepartmentLayout";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import MasterData from "../pages/admin/MasterData";
import RequestManagement from "../pages/admin/RequestManagement";
import Procurement from "../pages/admin/Procurement";
import Notifications from "../pages/admin/Notifications";
import Finance from "../pages/admin/Finance";
import Inventory from "../pages/admin/Inventory";
import AllocationTracking from "../pages/admin/AllocationTracking";

// Department Pages
import DepartmentDashboard from "../pages/department/Dashboard";
import DepartmentPortal from "../pages/department/DepartmentPortal";
import IssueReturnTracking from "../pages/department/IssueReturnTracking";
import DepartmentAllocation from "../pages/department/DepartmentAllocation";
export default function AppRoutes() {

  const auth = useContext(AuthContext);

  if (!auth) return null;

  return (
    <Routes>

      <Route
        path="/login"
        element={
          auth.isAuthenticated
            ? <Navigate to={auth.role === "admin" ? "/admin/dashboard" : "/department/dashboard"} />
            : <Login />
        }
      />
      {/* Admin */}
      <Route
        path="/admin"
        element={
          auth.isAuthenticated && auth.role === "admin"
            ? <AdminLayout />
            : <Navigate to="/login" replace />
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="master-data" element={<MasterData />} />
        <Route path="request-management" element={<RequestManagement />} />
        <Route path="procurement" element={<Procurement />} />
        <Route path="finance" element={<Finance />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="allocation-tracking" element={<AllocationTracking />} />
        <Route path="/admin/notifications" element={<Notifications />} />
      </Route>

      {/* Department */}
      {/* Department */}
      <Route
        path="/department"
        element={
          auth.isAuthenticated && auth.role === "hod"
            ? <DepartmentLayout />
            : <Navigate to="/login" replace />
        }
      >
        <Route path="dashboard" element={<DepartmentDashboard />} />
        <Route path="portal" element={<DepartmentPortal />} />
        <Route path="issues" element={<IssueReturnTracking />} />
        <Route path="allocation" element={<DepartmentAllocation />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}