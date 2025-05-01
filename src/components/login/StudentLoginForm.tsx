
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  { name: "Howard University", domain: "howard.edu" },
  { name: "Georgetown University", domain: "georgetown.edu" },
  { name: "University of Maryland", domain: "umd.edu" },
  { name: "George Washington University", domain: "gwu.edu" },
  { name: "American University", domain: "american.edu" },
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
                <SelectItem key={uni.domain} value={uni.name}>
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
              selectedUniversity ? 
              `student@${universities.find(u => u.name === selectedUniversity)?.domain}` : 
              "student@university.edu"
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
      
      <Button type="submit" className="w-full mt-6">
        Sign In
      </Button>
      
      <div className="text-xs text-center text-gray-500 mt-4">
        *Students must use their university email address
      </div>
    </form>
  );
};
