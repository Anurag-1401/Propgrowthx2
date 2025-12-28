import { Route, Routes } from "react-router-dom";
// import {Login} from "./pages/login_signup";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import AuthPage from "./pages/AuthPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard_owner" element={<OwnerDashboard />} />
      <Route path="/dashboard_tenant" element={<TenantDashboard />} />
    </Routes>
  );
}
export default App;
