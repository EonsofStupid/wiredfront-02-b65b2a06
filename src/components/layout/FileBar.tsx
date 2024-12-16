import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useAIStore, useRoutesStore } from "@/stores";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface FileBarProps {
  position: 'left' | 'right';
}

export const FileBar = ({ position }: FileBarProps) => {
  const toggleAIAssistant = useAIStore((state) => state.toggleAIAssistant);
  const routes = useRoutesStore((state) => state.routes);
  
  // Memoize filtered routes to prevent unnecessary re-renders
  const sidebarRoutes = useMemo(() => 
    routes.filter(route => route.isEnabled && route.showInSidebar),
    [routes]
  );

  return (
    <div className={cn(
      "h-full glass-card border-white/10 flex flex-col items-center py-4 gap-4",
      position === 'left' ? 'border-r' : 'border-l'
    )}>
      {sidebarRoutes.map(route => (
        <Link key={route.id} to={route.path}>
          <Button 
            variant="ghost" 
            size="icon"
            className="nav-button"
          >
            <route.icon className="h-4 w-4" />
          </Button>
        </Link>
      ))}
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleAIAssistant}
        className="nav-button"
      >
        <Bot className="h-4 w-4" />
      </Button>
    </div>
  );
};