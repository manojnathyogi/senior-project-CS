
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue mx-auto flex items-center justify-center text-white text-2xl font-bold mb-6">
          404
        </div>
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the page you were looking for. Let's get you back to somewhere familiar.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <Home size={18} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
