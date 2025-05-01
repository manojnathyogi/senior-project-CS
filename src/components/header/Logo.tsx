
import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white font-bold">
        M
      </div>
      <h1 className="text-xl font-bold text-foreground">MindEase</h1>
    </Link>
  );
};

export default Logo;
