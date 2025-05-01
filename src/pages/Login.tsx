
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const universities = [
  { name: "Howard University", domain: "howard.edu" },
  { name: "Georgetown University", domain: "georgetown.edu" },
  { name: "University of Maryland", domain: "umd.edu" },
  { name: "George Washington University", domain: "gwu.edu" },
  { name: "American University", domain: "american.edu" },
];

// Demo credentials
const demoStudentCredentials = {
  email: "student@howard.edu",
  password: "password123"
};

const demoAdminCredentials = {
  email: "admin@mindease.com",
  password: "admin123"
};

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>("Howard University"); // Default to Howard

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Demo authentication logic
    if (loginType === "student") {
      if (!selectedUniversity) {
        toast.error("Please select your university");
        return;
      }
      
      const universityDomain = universities.find(u => u.name === selectedUniversity)?.domain;
      if (!email.endsWith(`@${universityDomain}`)) {
        toast.error(`Please use your ${selectedUniversity} email address`);
        return;
      }
      
      if (email === demoStudentCredentials.email && password === demoStudentCredentials.password) {
        localStorage.setItem("mindease_user", JSON.stringify({
          type: "student",
          name: "Sam Johnson",
          university: selectedUniversity,
          email: email
        }));
        toast.success("Student login successful");
        navigate("/");
      } else {
        toast.error("Invalid credentials. Try using: student@howard.edu / password123");
      }
    } else {
      // Admin login
      if (email === demoAdminCredentials.email && password === demoAdminCredentials.password) {
        localStorage.setItem("mindease_user", JSON.stringify({
          type: "admin",
          name: "Admin User",
          email: email
        }));
        toast.success("Admin login successful");
        navigate("/");
      } else {
        toast.error("Invalid admin credentials. Try using: admin@mindease.com / admin123");
      }
    }
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
                  {loginType === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="university">Select your university</Label>
                      <Select 
                        defaultValue="Howard University"
                        onValueChange={setSelectedUniversity}
                      >
                        <SelectTrigger id="university">
                          <SelectValue placeholder="Select university" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((uni) => (
                            <SelectItem key={uni.domain} value={uni.name}>
                              {uni.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder={loginType === "student" ? 
                        (selectedUniversity ? 
                          `student@${universities.find(u => u.name === selectedUniversity)?.domain}` : 
                          "student@university.edu") : 
                        "admin@mindease.com"
                      }
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
                    {loginType === "student" && (
                      <p className="text-xs text-muted-foreground">Demo: student@howard.edu / password123</p>
                    )}
                    {loginType === "admin" && (
                      <p className="text-xs text-muted-foreground">Demo: admin@mindease.com / admin123</p>
                    )}
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
