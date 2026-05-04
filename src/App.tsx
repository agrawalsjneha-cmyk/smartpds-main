import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import AuditorDashboard from "./pages/AuditorDashboard";
import BeneficiaryDashboard from "./pages/BeneficiaryDashboard";
import Grievance from "./pages/Grievance";
import NotFound from "./pages/NotFound";
import BeneficiaryList from "./pages/BeneficiaryList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/operator" element={<OperatorDashboard />} />
          <Route path="/auditor" element={<AuditorDashboard />} />
          <Route path="/beneficiary" element={<BeneficiaryDashboard />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/beneficiaries" element={<BeneficiaryList />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
