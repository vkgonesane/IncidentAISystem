import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import IntelligenceGuide from "./pages/IntelligenceGuide";
import Login from "./pages/Login";
import NotificationSettings from "./pages/NotificationSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intelligence-guide"
          element={
            <ProtectedRoute>
              <IntelligenceGuide />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notification-settings"
          element={
            <ProtectedRoute>
              <NotificationSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;