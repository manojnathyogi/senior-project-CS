
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const CounselorLogin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Redirect if already logged in as counselor
  useEffect(() => {
    if (!authLoading && user?.role === "counselor") {
      navigate("/counselor-dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      // Login with Django API
      const response = await api.loginWithPassword(email, password);
      
      // Store tokens
      if (response.access && response.refresh) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }
      
      // Verify role is counselor
      if (response.user?.role !== "counselor") {
        toast.error("This account is not a counselor account");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setLoading(false);
        return;
      }
      
      toast.success(`Welcome back, ${response.user.name || 'Counselor'}`);
      
      // Redirect to counselor dashboard - use window.location to force auth refresh
      setTimeout(() => {
        window.location.href = "/counselor-dashboard";
      }, 500);
    } catch (error: any) {
      const errorMessage = error.message || "Invalid credentials";
      
      // Check if account is OTP-only
      if (errorMessage.includes("OTP only") || errorMessage.includes("Login with OTP Code")) {
        toast.error("This account uses OTP authentication. Please contact your administrator.");
      } else {
        toast.error(errorMessage);
      }
      setLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  if (user?.role === "counselor") {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-2 rounded-full bg-primary/10">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Counselor Portal</h1>
          <p className="text-muted-foreground">Sign in to access your MindEase counselor dashboard</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Counselor Sign In</CardTitle>
            <CardDescription>
              Access your student cases and communications
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="counselor@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Not a counselor?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
              Student login
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CounselorLogin;
