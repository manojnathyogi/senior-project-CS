
import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionButtons = () => {
  const navigate = useNavigate();
  
  const goToSettings = () => {
    navigate("/settings");
  };

  return (
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
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={goToSettings}
      >
        <Settings size={20} />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell size={20} />
      </Button>
    </div>
  );
};

export default ActionButtons;
