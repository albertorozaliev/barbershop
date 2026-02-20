import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";

import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Notifications from "./pages/Notifications";

import ManagerProjects from "./pages/ManagerProjects";
import ManagerClients from "./pages/ManagerClients";
import ManagerReports from "./pages/ManagerReports";
import ManagerNotifications from "./pages/ManagerNotifications";

import DesignerProjects from "./pages/DesignerProjects";
import DesignerNotifications from "./pages/DesignerNotifications";

function PrivateRoute({ children }) {
  const isAuth = localStorage.getItem("isAuth") === "true";
  return isAuth ? children : <Navigate to="/" />;
}

function RoleRoute({ role, children }) {
  const r = localStorage.getItem("role");
  return r === role ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />

        {/* LEADER */}
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <RoleRoute role="leader">
                <Projects />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <RoleRoute role="leader">
                <Clients />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <RoleRoute role="leader">
                <Reports />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <RoleRoute role="leader">
                <Users />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <RoleRoute role="leader">
                <Notifications />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* MANAGER */}
        <Route
          path="/m/projects"
          element={
            <PrivateRoute>
              <RoleRoute role="manager">
                <ManagerProjects />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/m/clients"
          element={
            <PrivateRoute>
              <RoleRoute role="manager">
                <ManagerClients />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/m/reports"
          element={
            <PrivateRoute>
              <RoleRoute role="manager">
                <ManagerReports />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/m/notifications"
          element={
            <PrivateRoute>
              <RoleRoute role="manager">
                <ManagerNotifications />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* DESIGNER */}
        <Route
          path="/d/projects"
          element={
            <PrivateRoute>
              <RoleRoute role="designer">
                <DesignerProjects />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/d/notifications"
          element={
            <PrivateRoute>
              <RoleRoute role="designer">
                <DesignerNotifications />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* default */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}