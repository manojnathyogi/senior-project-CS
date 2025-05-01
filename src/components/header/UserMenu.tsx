
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface User {
  type: "student" | "admin";
  name: string;
  university?: string;
  email: string;
}

interface UserMenuProps {
  user: User | null;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("mindease_user");
    toast.success("Successfully logged out");
    navigate("/login");
  };
  
  const goToAdminDashboard = () => {
    navigate("/admin");
  };

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate("/login")}
      >
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium mr-2 hidden sm:inline-block">
        {user.name}
      </span>
      {user.type === "admin" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToAdminDashboard}
          className="mr-1"
        >
          Admin Dashboard
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={handleLogout}
      >
        <LogOut size={18} />
      </Button>
    </div>
  );
};

export default UserMenu;
