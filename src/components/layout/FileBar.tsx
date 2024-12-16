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
    <div className={cn(
      "h-full glass-card border-white/10 flex flex-col items-center py-4 gap-4",
      position === 'left' ? 'border-r' : 'border-l'
    )}>
      <Link to="/files">
        <Button 
          variant="ghost" 
          size="icon"
          className="nav-button"
        >
          <File className="h-4 w-4" />
        </Button>
      </Link>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleAIAssistant}
        className="nav-button"
      >
        <Bot className="h-4 w-4" />
      </Button>
      
      <Link to="/media">
        <Button 
          variant="ghost" 
          size="icon"
          className="nav-button"
        >
          <Image className="h-4 w-4" />
        </Button>
      </Link>
      
      <Link to="/settings">
        <Button 
          variant="ghost" 
          size="icon"
          className="nav-button"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};