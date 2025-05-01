
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordDialog = ({ open, onOpenChange }: ForgotPasswordDialogProps) => {
  const [resetEmail, setResetEmail] = useState("");
  
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Simulate sending a password reset email
    toast.success(`Password reset link sent to ${resetEmail}`);
    onOpenChange(false);
    setResetEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleForgotPassword}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Send reset link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
