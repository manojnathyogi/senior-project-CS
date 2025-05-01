
import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white font-bold">
          M
        </div>
        <h1 className="text-xl font-bold text-foreground">MindEase</h1>
      </div>
      <button className="p-2 rounded-full hover:bg-gray-100">
        <Bell size={24} />
      </button>
    </header>
  );
};

export default Header;
