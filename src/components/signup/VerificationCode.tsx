
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";

interface VerificationCodeProps {
  email: string;
  onVerify: () => void;
  onResend: () => void;
}

const VerificationCode = ({ email, onVerify, onResend }: VerificationCodeProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, we'll use a hardcoded verification code
    if (verificationCode === "123456") {
      toast.success("Email verified successfully!");
      onVerify();
    } else {
      toast.error("Invalid verification code, please try again");
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    toast.info("A new verification code has been sent to your email");
    onResend();
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">Verify your email</h2>
      <p className="text-muted-foreground text-center mb-6">
        We've sent a 6-digit verification code to<br />
        <span className="font-medium">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <InputOTP 
            maxLength={6} 
            value={verificationCode} 
            onChange={setVerificationCode}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} index={index} />
                ))}
              </InputOTPGroup>
            )}
          />

          <Button 
            type="submit" 
            disabled={verificationCode.length !== 6}
            className="w-full mt-4"
          >
            Verify Email
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
