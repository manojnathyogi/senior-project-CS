
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/hooks/useTheme";

import Index from "./pages/Index";
import Wellness from "./pages/Wellness";
import Campus from "./pages/Campus";
import Peers from "./pages/Peers";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import CounselorLogin from "./pages/CounselorLogin";
import CounselorDashboard from "./pages/CounselorDashboard";

const queryClient = new QueryClient();

const App = () => {
  const [userType, setUserType] = useState<"student" | "admin" | "counselor" | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("mindease_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserType(user.type);
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                userType === "admin" ? <Navigate to="/admin" replace /> : 
                userType === "counselor" ? <Navigate to="/counselor-dashboard" replace /> :
                <Index />
              } />
              <Route path="/campus" element={<Campus />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/peers" element={<Peers />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/counselor-login" element={<CounselorLogin />} />
              <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
