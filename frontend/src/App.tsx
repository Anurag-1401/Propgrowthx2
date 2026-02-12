import { Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./hooks/ScrollToTop";
import PrivateRoute from "./hooks/PrivateRoute";
import PublicRoute from "./hooks/PublicRoute";
import AuthPage from "./pages/AuthPage";
import SetPassword from "./pages/SetPassword";
import Index from "./pages/Index";
import OwnerDashboard from "./pages/dashboard/owner/OwnerDashboard";
import OwnerProperties from "./pages/dashboard/owner/OwnerProperties";
import OwnerTransactions from "./pages/dashboard/owner/OwnerTransactions";
import TenantDashboard from "./pages/dashboard/tenant/TenantDashboard";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import TenantComplaints from "./pages/dashboard/tenant/TenantComplaints";
import TenantTransactions from "./pages/dashboard/tenant/TenantTransactions";
import OwnerComplaints from "./pages/dashboard/owner/OwnerComplaints";
import { DataProvider } from "./context/dataContext";
import AboutUsPage from "./pages/AboutUsPage";

function App() { 
  return (
    <HelmetProvider>
      <ScrollToTop />
      <DataProvider>
        <Routes>

        <Route path="/" element={<Index />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about-us" element={<AboutUsPage />} />

        <Route element={<PublicRoute />}>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/setPassword" element={<SetPassword />} />
        </Route>    

        <Route element={<PrivateRoute allowedRoles={["owner"]} />}>
          <Route path="/dashboard/owner" element={<OwnerDashboard />} />
          <Route path="/dashboard/owner/properties" element={<OwnerProperties />} />
          <Route path="/dashboard/owner/transactions" element={<OwnerTransactions />} />
          <Route path="/dashboard/owner/complaints" element={<OwnerComplaints />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["tenant"]} />}>
          <Route path="/dashboard/tenant" element={<TenantDashboard />} /> 
          <Route path="/dashboard/tenant/complaints" element={<TenantComplaints />} />
          <Route path="/dashboard/tenant/transactions" element={<TenantTransactions />} />
        </Route>


          <Route element={<PrivateRoute />}>
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
          </Route>

        <Route path="*" element={<NotFound />} />  
        
      </Routes>
      </DataProvider>
    </HelmetProvider>
  );
}
export default App;

