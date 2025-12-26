import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
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
