import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard1 from "./pages/Dashboard/Dashboard1";
import Dashboard2 from "./pages/Dashboard/Dashboard2";
import Dashboard3 from "./pages/Dashboard/Dashboard3";
import Dashboard4 from "./pages/Dashboard/Dashboard4";

import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* ================= PROTECTED ROUTES ================= */}

        <Route
          path="/dashboard1"
          element={
            <ProtectedRoute>
              <Dashboard1 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard2"
          element={
            <ProtectedRoute>
              <Dashboard2 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard3"
          element={
            <ProtectedRoute>
              <Dashboard3 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard4"
          element={
            <ProtectedRoute>
              <Dashboard4 />
            </ProtectedRoute>
          }
        />


        {/* ================= DEFAULT ROUTE ================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;