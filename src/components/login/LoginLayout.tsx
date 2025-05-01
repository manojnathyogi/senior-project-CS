
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LoginLayoutProps {
  children: ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-mindSoftPurple to-mindSoftBlue p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white font-bold text-3xl mb-4">
            M
          </div>
          <h1 className="text-2xl font-bold text-foreground">MindEase</h1>
          <p className="text-muted-foreground">Your mental wellness companion</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your MindEase account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
