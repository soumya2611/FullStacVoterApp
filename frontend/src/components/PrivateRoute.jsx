import { Navigate, Route } from "react-router-dom";

function PrivateRoute({ element, role, ...rest }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // You can optionally validate the user’s role here from the token payload
  // if the role does not match, redirect
  if (role && role !== "admin" && role !== "user") {
    return <Navigate to="/login" />;
  }

  return <Route {...rest} element={element} />;
}

export default PrivateRoute;
