
import { useState } from "react";
import { LoginLayout } from "@/components/login/LoginLayout";
import { LoginTabs } from "@/components/login/LoginTabs";
import { StudentLoginForm } from "@/components/login/StudentLoginForm";
import { AdminLoginForm } from "@/components/login/AdminLoginForm";
import { ForgotPasswordDialog } from "@/components/login/ForgotPasswordDialog";
import { useAuthentication } from "@/hooks/useAuthentication";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    handleLogin 
  } = useAuthentication(loginType);
  
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
      />
      
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
      
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground mb-2">Are you a counselor?</p>
        <Button variant="outline" onClick={() => navigate("/counselor-login")}>
          Go to Counselor Login
        </Button>
      </div>
    </LoginLayout>
  );
};

export default Login;
