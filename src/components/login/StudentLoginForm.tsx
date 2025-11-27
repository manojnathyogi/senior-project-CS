
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail } from "lucide-react";

interface StudentLoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  setForgotPasswordOpen: (open: boolean) => void;
}

// Demo credentials
const demoStudentCredentials = {
  email: "student@howard.edu",
  password: "password123"
};

export const universities = [
  { name: "Howard University", domains: ["howard.edu", "bison.howard.edu"] },
  { name: "Georgetown University", domains: ["georgetown.edu"] },
  { name: "University of Maryland", domains: ["umd.edu"] },
  { name: "George Washington University", domains: ["gwu.edu"] },
  { name: "American University", domains: ["american.edu"] },
];

export const StudentLoginForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  handleLogin,
  setForgotPasswordOpen
}: StudentLoginFormProps) => {
  const navigate = useNavigate();
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>("Howard University"); // Default to Howard
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleOTPRequest = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    
    setLoading(true);
    try {
      await api.requestOTP(email, 'login');
      toast.success(`OTP code sent to ${email}`);
      setOtpSent(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP code");
    } finally {
      setLoading(false);
    }
  };
  
  const handleOTPVerify = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.verifyOTPLogin(email, otpCode);
      
      // Store tokens
      if (response.access && response.refresh) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }
      
      toast.success("Login successful!");
      // Reload page to refresh auth state
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };
  
  if (otpSent) {
    return (
      <div className="space-y-4 mt-4">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Enter Verification Code</h3>
          <p className="text-muted-foreground text-center mb-4 text-sm">
            We've sent a 6-digit code to<br />
            <span className="font-medium">{email}</span>
          </p>
          
          <div className="bg-muted p-4 rounded-lg mb-4 w-full max-w-xs">
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span className="text-sm">Check your email for the code</span>
            </div>
          </div>
          
          <div className="w-full space-y-4">
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otpCode} 
                onChange={setOtpCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button
              type="button"
              className="w-full"
              onClick={handleOTPVerify}
              disabled={otpCode.length !== 6 || loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleOTPRequest}
              disabled={loading}
            >
              Resend Code
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setOtpSent(false);
                setOtpCode("");
              }}
            >
              Back to password login
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleLogin}>
      <div className="space-y-4 mt-4">
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
                <SelectItem key={uni.name} value={uni.name}>
                  {uni.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder={
              selectedUniversity === "Howard University"
                ? "student@howard.edu or student@bison.howard.edu"
                : selectedUniversity
                ? `student@${universities.find(u => u.name === selectedUniversity)?.domains[0]}`
                : "student@university.edu"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={() => setForgotPasswordOpen(true)}
            >
              Forgot password?
            </Button>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Demo: student@howard.edu / password123</p>
        </div>
      </div>
      
      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleOTPRequest}
        disabled={loading || !email}
      >
        {loading ? "Sending..." : "Login with OTP Code"}
      </Button>
      
      <div className="text-xs text-center text-gray-500 mt-4">
        *Students must use their university email address
      </div>
      <div className="text-xs text-center text-muted-foreground mt-2">
        Signed up with OTP? Use "Login with OTP Code" above
      </div>
    </form>
  );
};
