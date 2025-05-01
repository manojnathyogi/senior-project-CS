
import { useEffect, useState } from "react";
import Logo from "@/components/header/Logo";
import UserMenu from "@/components/header/UserMenu";
import ActionButtons from "@/components/header/ActionButtons";

interface User {
  type: "student" | "admin";
  name: string;
  university?: string;
  email: string;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("mindease_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  return (
    <header className="p-4 flex justify-between items-center">
      <Logo />
      
      <div className="flex items-center gap-2">
        <UserMenu user={user} />
        <ActionButtons />
      </div>
    </header>
  );
};

export default Header;
