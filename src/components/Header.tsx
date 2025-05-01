
import { Bell, Settings, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white font-bold">
          M
        </div>
        <h1 className="text-xl font-bold text-foreground">MindEase</h1>
      </div>
      <div className="flex items-center gap-2">
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
