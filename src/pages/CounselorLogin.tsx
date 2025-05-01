
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Shield } from "lucide-react";

const CounselorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Demo login for counselors
    setTimeout(() => {
      setLoading(false);
      
      if (email.includes("counselor") && password === "counselor123") {
        localStorage.setItem("mindease_user", JSON.stringify({
          type: "counselor",
          name: "Dr. Carter",
          university: "Howard University",
          email: email,
        }));
        
        toast.success("Welcome back, Dr. Carter");
        navigate("/counselor-dashboard");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    }, 1500);
  };
  
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
              
              <div className="space-y-2">
                <Label htmlFor="verification">Counselor Verification Code</Label>
                <Input
                  id="verification"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your department administrator can provide this code
                </p>
              </div>
              
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Demo credentials: counselor@mindease.com / counselor123
                  </AlertDescription>
                </div>
              </Alert>
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
