import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import Signup from "./pages/auth/SignUp";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />

        {/* Admin Protected Route */}
        <Route
          path="/admin/dashboard"
          element={token ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* User Protected Route */}
        <Route
          path="/user/dashboard"
          element={token ? <UserDashboard /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* Toast Container for global notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
