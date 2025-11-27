
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import VerificationCode from "@/components/signup/VerificationCode";
import { api } from "@/lib/api";

const universities = [
  { name: "Howard University", domains: ["howard.edu", "bison.howard.edu"] },
  { name: "Georgetown University", domains: ["georgetown.edu"] },
  { name: "University of Maryland", domains: ["umd.edu"] },
  { name: "George Washington University", domains: ["gwu.edu"] },
  { name: "American University", domains: ["american.edu"] },
];

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: Verification
  
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "Howard University",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUniversityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, university: value }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else {
      // Check if email is from Howard University (must be @howard.edu or @bison.howard.edu)
      const emailDomain = '@' + formData.email.split('@')[1];
      const allowedDomains = ['@howard.edu', '@bison.howard.edu'];
      
      if (!allowedDomains.includes(emailDomain)) {
        newErrors.email = "Email must be from Howard University (@howard.edu or @bison.howard.edu)";
        valid = false;
      }
    }

    // Password is required for signup
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Request OTP from Django backend (this will send verification email)
      await api.requestOTP(formData.email, 'signup');
      toast.success(`Verification code sent to ${formData.email}`);
      setStep(2);
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerificationComplete = async () => {
    // After email verification, user profile is already created
    toast.success("Email verified! Account created successfully.");
    navigate("/login");
  };
  
  const handleResendCode = async () => {
    try {
      await api.requestOTP(formData.email, 'signup');
      toast.success("Verification code resent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification code");
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="johndoe123"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="university">Select your university</Label>
        <Select
          defaultValue="Howard University"
          onValueChange={handleUniversityChange}
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
            name="email"
            type="email"
            placeholder={
              formData.university === "Howard University" 
                ? "student@howard.edu or student@bison.howard.edu"
                : `student@${
                    universities.find((uni) => uni.name === formData.university)?.domains[0]
                  }`
            }
            value={formData.email}
            onChange={handleChange}
          />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>
      
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters. You can also login with OTP code later.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      
      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );

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
            <div className="flex items-center mb-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full mr-2"
                onClick={() => step === 1 ? navigate("/login") : setStep(1)}
              >
                <ArrowLeft size={18} />
              </Button>
              <CardTitle>{step === 1 ? "Create an Account" : "Verify Email"}</CardTitle>
            </div>
            <CardDescription>
              {step === 1 
                ? "Join MindEase to start your wellness journey" 
                : "Enter the verification code sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              renderForm()
            ) : (
              <VerificationCode 
                email={formData.email}
                onVerify={handleVerificationComplete}
                onResend={handleResendCode}
                userData={{
                  name: formData.fullName,
                  username: formData.username,
                  university: formData.university,
                  role: "student",
                  password: formData.password, // Password is required
                }}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
