
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Automation from "./pages/Automation";
import Contact from "./pages/Contact";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-dashboard-secure" element={<AdminDashboard />} />
            <Route path="/*" element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/automation" element={<Automation />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
