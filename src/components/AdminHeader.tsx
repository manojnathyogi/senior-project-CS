
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const AdminHeader = () => {
  const { user, signOut } = useAuth();
  
  const handleLogout = () => {
    signOut();
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
      
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden md:inline-block">
            {user.name}
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline-block">Logout</span>
          </Button>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
