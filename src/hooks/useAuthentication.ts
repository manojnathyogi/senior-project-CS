
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const useAuthentication = (loginType: "student" | "admin" | "counselor") => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    // If no password provided, use OTP login
    if (!password) {
      toast.error("Please enter your password or use OTP login");
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate university email for students - must be Howard University email
      if (loginType === "student") {
        const emailDomain = '@' + email.split('@')[1];
        const allowedDomains = ['@howard.edu', '@bison.howard.edu'];
        
        if (!allowedDomains.includes(emailDomain)) {
          toast.error(`Email must be from Howard University (@howard.edu or @bison.howard.edu)`);
          setLoading(false);
          return;
        }
      }
      
      // Try password login with Django
      try {
        const response = await api.loginWithPassword(email, password);
        
        // Store tokens
        if (response.access && response.refresh) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
        }
        
        // Verify role matches login type
        if (loginType === "student" && response.user?.role !== "student") {
          toast.error("This account is not a student account");
          setLoading(false);
          return;
        }
        
        if (loginType === "admin" && response.user?.role !== "admin") {
          toast.error("This account is not an admin account");
          setLoading(false);
          return;
        }
        
        if (loginType === "counselor" && response.user?.role !== "counselor") {
          toast.error("This account is not a counselor account");
          setLoading(false);
          return;
        }
        
        toast.success("Login successful!");
        
        // Reload page to refresh auth state
        const redirectPath = response.user?.role === "admin" ? "/admin" : 
                            response.user?.role === "counselor" ? "/counselor-dashboard" : "/";
        window.location.href = redirectPath;
      } catch (error: any) {
        // Show the error message from backend
        const errorMessage = error.message || "Invalid credentials";
        
        // If backend says account is OTP-only, show helpful message
        if (errorMessage.includes("OTP only") || errorMessage.includes("Login with OTP Code")) {
          toast.error(errorMessage, {
            duration: 5000,
            action: {
              label: "Use OTP Login",
              onClick: () => {
                // Could trigger OTP login flow here if needed
              }
            }
          });
        } else {
          toast.error(errorMessage);
        }
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login");
      setLoading(false);
    }
  };
  
  return { email, setEmail, password, setPassword, handleLogin, loading };
};
