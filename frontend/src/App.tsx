import { Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AuthPage from "./pages/AuthPage";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import OwnerProperties from "./pages/dashboard/OwnerProperties";
import OwnerTransactions from "./pages/dashboard/OwnerTransactions";function App() {
  return (
    <HelmetProvider>
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard/owner" element={<OwnerDashboard />} />
      <Route path="/dashboard/owner/properties" element={<OwnerProperties />} />
      <Route path="/dashboard/owner/transactions" element={<OwnerTransactions />} />    
    </Routes>
    </HelmetProvider>
  );
}
export default App;

