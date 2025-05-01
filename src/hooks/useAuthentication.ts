
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { universities } from "@/components/login/StudentLoginForm";

// Demo credentials
const demoStudentCredentials = {
  email: "student@howard.edu",
  password: "password123"
};

const demoAdminCredentials = {
  email: "admin@mindease.com",
  password: "admin123"
};

export const useAuthentication = (loginType: "student" | "admin") => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Demo authentication logic
    if (loginType === "student") {
      const universityDomain = email.split('@')[1];
      const isValidUniversityEmail = universities.some(u => u.domain === universityDomain);
      
      if (!isValidUniversityEmail) {
        toast.error(`Please use your university email address`);
        return;
      }
      
      if (email === demoStudentCredentials.email && password === demoStudentCredentials.password) {
        localStorage.setItem("mindease_user", JSON.stringify({
          type: "student",
          name: "Sam Johnson",
          university: "Howard University",
          email: email,
          username: "samjohnson"
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
          email: email,
          username: "adminuser"
        }));
        toast.success("Admin login successful");
        navigate("/");
      } else {
        toast.error("Invalid admin credentials. Try using: admin@mindease.com / admin123");
      }
    }
  };
  
  return { email, setEmail, password, setPassword, handleLogin };
};
