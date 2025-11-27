
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Mail } from "lucide-react";
import { api } from "@/lib/api";

interface VerificationCodeProps {
  email: string;
  onVerify: () => void;
  onResend: () => void;
  userData: {
    name: string;
    username?: string;
    university?: string;
    role?: string;
    password: string; // Required - OTP is only for email verification
  };
}

const VerificationCode = ({ email, onVerify, onResend, userData }: VerificationCodeProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify the OTP code with Django backend
      const response = await api.verifyOTPSignup(email, verificationCode, userData);
      
      // Store tokens in localStorage
      if (response.access && response.refresh) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }
      
      toast.success("Email verified successfully! Account created.");
      // Redirect to home page to trigger auth refresh
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimeLeft(60);
    onResend();
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">Verify your email</h2>
      <p className="text-muted-foreground text-center mb-6">
        We've sent a 6-digit verification code to<br />
        <span className="font-medium">{email}</span>
      </p>

      <div className="bg-muted p-4 rounded-lg mb-6 w-full max-w-xs">
        <div className="flex items-center gap-2">
          <Mail size={18} />
          <span className="text-sm">Check your email for the verification code</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <InputOTP 
            maxLength={6} 
            value={verificationCode} 
            onChange={setVerificationCode}
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

          <Button 
            type="submit" 
            disabled={verificationCode.length !== 6 || loading}
            className="w-full mt-4"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive a code?
        </p>
        <Button
          variant="link"
          className="p-0 h-auto"
          disabled={timeLeft > 0}
          onClick={handleResend}
        >
          {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend code"}
        </Button>
      </div>
    </div>
  );
};

export default VerificationCode;
