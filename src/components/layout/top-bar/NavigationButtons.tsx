import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoutesStore } from "@/stores";
import { useMemo } from "react";

export const NavigationButtons = () => {
  const navigate = useNavigate();
  const routes = useRoutesStore((state) => state.routes);
  
  // Memoize enabled routes to prevent unnecessary re-renders
  const enabledRoutes = useMemo(() => 
    routes.filter(route => route.isEnabled),
    [routes]
  );

  const handleNavigation = (direction: 'back' | 'forward') => {
    if (direction === 'back') {
      navigate(-1);
    } else {
      navigate(1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleNavigation('back')}
        className="nav-button"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleNavigation('forward')}
        className="nav-button"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};