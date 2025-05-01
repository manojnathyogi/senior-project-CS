
import { Bell, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  type: "admin";
  name: string;
  email: string;
}

const AdminHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("mindease_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.type === "admin") {
        setUser(parsedUser);
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("mindease_user");
    setUser(null);
    toast.success("Successfully logged out");
    navigate("/login");
  };
  
  return (
    <header className="p-4 flex justify-between items-center bg-background border-b">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white font-bold">
          M
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">MindEase Admin</h1>
          <p className="text-xs text-muted-foreground">Mental Health Analytics Dashboard</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium mr-2 hidden md:inline-block">
              {user.name}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell size={20} />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
