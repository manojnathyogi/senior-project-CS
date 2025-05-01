
import { Bell, Settings, Phone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  type: "student" | "admin";
  name: string;
  university?: string;
  email: string;
}

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("mindease_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("mindease_user");
    setUser(null);
    toast.success("Successfully logged out");
    navigate("/login");
  };
  
  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white font-bold">
          M
        </div>
        <h1 className="text-xl font-bold text-foreground">MindEase</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium mr-2 hidden sm:inline-block">
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
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        )}
        <Button 
          variant="destructive" 
          size="icon" 
          className="rounded-full" 
          onClick={() => window.open("tel:988", "_self")}
          aria-label="Emergency Call"
        >
          <Phone size={18} />
        </Button>
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

export default Header;
