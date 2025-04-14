import React from "react";
import { Button } from "@/components/ui/button"; // adjust the import based on your Button component path

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-6 relative z-10">
      {/* Logo */}
      <div className="text-white text-2xl font-bold">ESCAPEAI</div>

      {/* Links */}
      {/* <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-8">
        <a href="#" className="font-medium text-black">
          Home
        </a>
        <a href="#" className="font-medium text-gray-500">
          About
        </a>
        <a href="#" className="font-medium text-gray-500">
          Bookmark Trip
        </a>
        <a href="#" className="font-medium text-gray-500">
          Friends
        </a>
      </div> */}

      {/* CTA Button */}
      {/* <Button className="rounded-full bg-white text-black hover:bg-gray-100">
        Log In
      </Button> */}
    </nav>
  );
};

export default Navbar;
