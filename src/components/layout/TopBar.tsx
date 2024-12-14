import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { File, Settings, Image, Bot, Menu, Search, Bell, User } from "lucide-react";
import { useAIStore } from "@/stores";

export const TopBar = () => {
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);

  return (
    <div className="h-16 glass-card border-b border-white/10 flex items-center justify-between px-4 z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="cyber-button group">
          <Menu className="h-5 w-5 transition-all duration-300 group-hover:text-neon-blue" />
        </Button>
        <Link to="/" className="text-lg font-semibold gradient-text">
          wiredFRONT
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/files">
            <Button variant="ghost" size="icon" className="cyber-button group">
              <File className="h-4 w-4 transition-all duration-300 group-hover:text-neon-pink" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAI}
            className="cyber-button group"
          >
            <Bot className="h-4 w-4 transition-all duration-300 group-hover:text-neon-violet" />
          </Button>
          <Link to="/media">
            <Button variant="ghost" size="icon" className="cyber-button group">
              <Image className="h-4 w-4 transition-all duration-300 group-hover:text-neon-teal" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="cyber-button group">
          <Search className="h-5 w-5 transition-all duration-300 group-hover:text-neon-blue" />
        </Button>
        <Button variant="ghost" size="icon" className="cyber-button group">
          <Bell className="h-5 w-5 transition-all duration-300 group-hover:text-neon-pink" />
        </Button>
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="cyber-button group">
            <User className="h-5 w-5 transition-all duration-300 group-hover:text-neon-violet" />
          </Button>
        </Link>
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="cyber-button group">
            <Settings className="h-5 w-5 transition-all duration-300 group-hover:text-neon-teal" />
          </Button>
        </Link>
      </div>
    </div>
  );
};