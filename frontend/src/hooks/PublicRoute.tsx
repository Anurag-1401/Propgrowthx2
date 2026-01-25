import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (token && role) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return <Outlet />;
}
