import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { File, Settings, Image, Bot } from "lucide-react";
import { useAIStore } from "@/stores";
import { cn } from "@/lib/utils";

interface FileBarProps {
  position: 'left' | 'right';
}

export const FileBar = ({ position }: FileBarProps) => {
  const toggleAIAssistant = useAIStore((state) => state.toggleAIAssistant);

  return (
    <div className="w-12 glass-card border-white/10 flex flex-col items-center py-4 gap-4 z-20">
      <Link to="/files" className="sidebar-button-container">
        <Button 
          variant="ghost" 
          size="icon"
          className="sidebar-button"
        >
          <File className="h-4 w-4" />
        </Button>
      </Link>
      
      <div className="sidebar-button-container">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleAIAssistant}
          className="sidebar-button"
        >
          <Bot className="h-4 w-4" />
        </Button>
      </div>
      
      <Link to="/media" className="sidebar-button-container">
        <Button 
          variant="ghost" 
          size="icon"
          className="sidebar-button"
        >
          <Image className="h-4 w-4" />
        </Button>
      </Link>
      
      <Link to="/settings" className="sidebar-button-container">
        <Button 
          variant="ghost" 
          size="icon"
          className="sidebar-button"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};