
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

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

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: "student" | "admin" | "counselor" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { user, loading } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                loading ? <div className="min-h-screen flex items-center justify-center">Loading...</div> :
                user?.role === "admin" ? <Navigate to="/admin" replace /> : 
                user?.role === "counselor" ? <Navigate to="/counselor-dashboard" replace /> :
                <Index />
              } />
              <Route path="/campus" element={<ProtectedRoute><Campus /></ProtectedRoute>} />
              <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
              <Route path="/peers" element={<ProtectedRoute><Peers /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
              <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignUp />} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/counselor-login" element={
                user?.role === "counselor" ? <Navigate to="/counselor-dashboard" replace /> : <CounselorLogin />
              } />
              <Route path="/counselor-dashboard" element={<ProtectedRoute requiredRole="counselor"><CounselorDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
