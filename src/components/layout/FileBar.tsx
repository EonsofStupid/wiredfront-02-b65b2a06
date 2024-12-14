import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { File, Settings, Image, Bot } from "lucide-react";
import { useAIStore } from "@/stores";
import { cn } from "@/lib/utils";

interface FileBarProps {
  position: 'left' | 'right';
}

export const FileBar = ({ position }: FileBarProps) => {
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);

  return (
    <div className="w-12 glass-card border-white/10 flex flex-col items-center py-4 gap-4 z-10">
      <Link to="/files">
        <Button 
          variant="ghost" 
          size="icon"
          className="cyber-button group relative overflow-hidden"
        >
          <File className="h-4 w-4 transition-all duration-300 group-hover:text-neon-blue" />
        </Button>
      </Link>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleAI}
        className="cyber-button group relative overflow-hidden"
      >
        <Bot className="h-4 w-4 transition-all duration-300 group-hover:text-neon-pink" />
      </Button>
      
      <Link to="/media">
        <Button 
          variant="ghost" 
          size="icon"
          className="cyber-button group relative overflow-hidden"
        >
          <Image className="h-4 w-4 transition-all duration-300 group-hover:text-neon-violet" />
        </Button>
      </Link>
      
      <Link to="/settings">
        <Button 
          variant="ghost" 
          size="icon"
          className="cyber-button group relative overflow-hidden"
        >
          <Settings className="h-4 w-4 transition-all duration-300 group-hover:text-neon-teal" />
        </Button>
      </Link>
    </div>
  );
};