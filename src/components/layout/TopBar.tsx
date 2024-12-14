import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { File, Settings, Image, Bot, Menu, Search, Bell, User } from "lucide-react";
import { useAIStore } from "@/stores";

export const TopBar = () => {
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);

  return (
    <div className="top-bar glass-card border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="nav-button">
          <Menu className="h-5 w-5 transition-all duration-300" />
        </Button>
        <Link to="/" className="text-lg font-semibold gradient-text">
          wiredFRONT
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/files">
            <Button variant="ghost" size="icon" className="nav-button">
              <File className="h-4 w-4 transition-all duration-300" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAI}
            className="nav-button"
          >
            <Bot className="h-4 w-4 transition-all duration-300" />
          </Button>
          <Link to="/media">
            <Button variant="ghost" size="icon" className="nav-button">
              <Image className="h-4 w-4 transition-all duration-300" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="nav-button">
          <Search className="h-5 w-5 transition-all duration-300" />
        </Button>
        <Button variant="ghost" size="icon" className="nav-button">
          <Bell className="h-5 w-5 transition-all duration-300" />
        </Button>
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="nav-button">
            <User className="h-5 w-5 transition-all duration-300" />
          </Button>
        </Link>
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="nav-button">
            <Settings className="h-5 w-5 transition-all duration-300" />
          </Button>
        </Link>
      </div>
    </div>
  );
};