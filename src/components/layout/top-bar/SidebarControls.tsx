import { Button } from "@/components/ui/button";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";
import { useLayoutStore } from "@/stores";

export const SidebarControls = () => {
  const { 
    sidebarOpen, 
    rightSidebarOpen,
    toggleSidebar, 
    toggleRightSidebar 
  } = useLayoutStore();

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="nav-button hover:bg-dark-lighter/30"
      >
        {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleRightSidebar}
        className="nav-button hover:bg-dark-lighter/30"
      >
        <PanelRightClose className={`h-5 w-5 transition-transform ${rightSidebarOpen ? 'rotate-180' : ''}`} />
      </Button>
    </div>
  );
};