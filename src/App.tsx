
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLogin from "./pages/AppLogin";
import BusinessDashboard from "./pages/BusinessDashboard";
import KOLDashboard from "./pages/KOLDashboard";
import KOLConnectWallet from "./pages/KOLConnectWallet";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/app" element={<AppLogin />} />
              <Route path="/business-dashboard" element={<BusinessDashboard />} />
              <Route path="/kol-dashboard" element={<KOLDashboard />} />
              <Route path="/kol-connect-wallet" element={<KOLConnectWallet />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
