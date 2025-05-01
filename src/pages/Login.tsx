
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (loginType === "student" && !email.endsWith(".edu")) {
      toast.error("Please use your university email (.edu)");
      return;
    }
    
    toast.success(`${loginType === "student" ? "Student" : "Admin"} login successful`);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-mindSoftPurple to-mindSoftBlue p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white font-bold text-3xl mb-4">
            M
          </div>
          <h1 className="text-2xl font-bold text-foreground">MindEase</h1>
          <p className="text-muted-foreground">Your mental wellness companion</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your MindEase account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" onValueChange={(v) => setLoginType(v as "student" | "admin")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleLogin}>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder={loginType === "student" ? "your.name@university.edu" : "admin@mindease.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-6">
                  Sign In
                </Button>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:underline">
                Sign up
              </a>
            </div>
            
            {loginType === "student" && (
              <div className="text-xs text-center text-gray-500">
                *Students must use their university email address
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
