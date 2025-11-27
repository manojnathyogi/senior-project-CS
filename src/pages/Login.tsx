
import { useState } from "react";
import { LoginLayout } from "@/components/login/LoginLayout";
import { LoginTabs } from "@/components/login/LoginTabs";
import { StudentLoginForm } from "@/components/login/StudentLoginForm";
import { AdminLoginForm } from "@/components/login/AdminLoginForm";
import { ForgotPasswordDialog } from "@/components/login/ForgotPasswordDialog";
import { useAuthentication } from "@/hooks/useAuthentication";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";

const CounselorLoginForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  handleLogin 
}: {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
}) => {
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="counselor-email">University Email</Label>
        <Input
          id="counselor-email"
          type="email"
          placeholder="counselor@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="counselor-password">Password</Label>
        <Input
          id="counselor-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
};

const Login = () => {
  const [loginType, setLoginType] = useState<"student" | "admin" | "counselor">("student");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    handleLogin: handleStudentAdminLogin,
    loading
  } = useAuthentication(loginType === "student" ? "student" : "admin");
  
  const handleCounselorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    
    try {
      const response = await api.loginWithPassword(email, password);
      
      if (response.access && response.refresh) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }
      
      if (response.user?.role !== "counselor") {
        toast.error("This account is not a counselor account");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return;
      }
      
      toast.success(`Welcome back, ${response.user.name || 'Counselor'}`);
      window.location.href = "/counselor-dashboard";
    } catch (error: any) {
      const errorMessage = error.message || "Invalid credentials";
      if (errorMessage.includes("OTP only") || errorMessage.includes("Login with OTP Code")) {
        toast.error("This account uses OTP authentication. Please contact your administrator.");
      } else {
        toast.error(errorMessage);
      }
    }
  };
  
  const handleLogin = loginType === "counselor" ? handleCounselorLogin : handleStudentAdminLogin;
  
  return (
    <LoginLayout>
      <LoginTabs
        loginType={loginType}
        onChangeLoginType={setLoginType}
        studentContent={
          <StudentLoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            setForgotPasswordOpen={setForgotPasswordOpen}
          />
        }
        adminContent={
          <AdminLoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            setForgotPasswordOpen={setForgotPasswordOpen}
          />
        }
        counselorContent={
          <CounselorLoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        }
      />
      
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </LoginLayout>
  );
};

export default Login;
