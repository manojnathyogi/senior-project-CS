
import Logo from "@/components/header/Logo";
import UserMenu from "@/components/header/UserMenu";
import ActionButtons from "@/components/header/ActionButtons";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user } = useAuth();
  
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
