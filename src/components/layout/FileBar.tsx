import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useAIStore, useRoutesStore } from "@/stores";
import { useTabStore } from "@/stores/tabs";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileBarProps {
  position: 'left' | 'right';
}

export const FileBar = ({ position }: FileBarProps) => {
  const toggleAIAssistant = useAIStore((state) => state.toggleAIAssistant);
  const routes = useRoutesStore((state) => state.routes);
  const addTab = useTabStore((state) => state.addTab);
  const { toast } = useToast();
  
  const sidebarRoutes = useMemo(() => 
    routes.filter(route => route.isEnabled && route.showInSidebar),
    [routes]
  );

  const handleRouteClick = (route: typeof routes[0]) => {
    addTab(route);
  };

  const handleAIToggle = () => {
    toggleAIAssistant();
    toast({
      title: "AI Assistant",
      description: "Press the robot button again to bring your assistant back!",
      className: "bg-dark-lighter border-neon-blue/50",
    });
  };

  return (
    <div className={cn(
      "side-bar",
      position === 'left' ? 'side-bar-left' : 'side-bar-right'
    )}>
      <div className="relative z-10 h-full flex flex-col items-center py-4 gap-4">
        {sidebarRoutes.map(route => (
          <Link 
            key={route.id} 
            to={route.path}
            onClick={() => handleRouteClick(route)}
          >
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
          onClick={handleAIToggle}
          className="nav-button"
        >
          <Bot className="h-4 w-4" />
        </Button>
      </div>
      <div className="data-stream" />
    </div>
  );
};