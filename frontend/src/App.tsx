import { Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import OwnerDashboard from "./pages/dashboard/owner/OwnerDashboard";
import OwnerProperties from "./pages/dashboard/owner/OwnerProperties";
import OwnerTransactions from "./pages/dashboard/owner/OwnerTransactions";
import TenantDashboard from "./pages/dashboard/tenant/TenantDashboard";
import Properties from "./pages/Properties";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import TenantComplaints from "./pages/dashboard/tenant/TenantComplaints";
import TenantTransactions from "./pages/dashboard/tenant/TenantTransactions";
import OwnerComplaints from "./pages/dashboard/owner/OwnerComplaints";


function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        <Route path="/dashboard/owner/properties" element={<OwnerProperties />} />
        <Route path="/dashboard/owner/transactions" element={<OwnerTransactions />} />
        <Route path="/dashboard/tenant" element={<TenantDashboard />} /> 
        <Route path="/dashboard/tenant/complaints" element={<TenantComplaints />} />
        <Route path="/dashboard/tenant/transactions" element={<TenantTransactions />} />
        <Route path="/dashboard/owner/complaints" element={<OwnerComplaints />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/properties" element={<Properties />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />  
      </Routes>
    </HelmetProvider>
  );
}
export default App;

