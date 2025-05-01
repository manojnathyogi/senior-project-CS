
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminLoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  setForgotPasswordOpen: (open: boolean) => void;
}

export const AdminLoginForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  handleLogin,
  setForgotPasswordOpen
}: AdminLoginFormProps) => {
  return (
    <form onSubmit={handleLogin}>
      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="admin@mindease.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={() => setForgotPasswordOpen(true)}
            >
              Forgot password?
            </Button>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Demo: admin@mindease.com / admin123</p>
        </div>
      </div>
      
      <Button type="submit" className="w-full mt-6">
        Sign In
      </Button>
    </form>
  );
};
