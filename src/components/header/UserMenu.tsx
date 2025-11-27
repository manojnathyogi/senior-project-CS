
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, type User } from "@/hooks/useAuth";

interface UserMenuProps {
  user: User | null;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleLogout = () => {
    signOut();
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
      {user.role === "admin" && (
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
