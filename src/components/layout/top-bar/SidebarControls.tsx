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
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="nav-button"
      >
        {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleRightSidebar}
        className="nav-button"
      >
        <PanelRightClose className={`h-5 w-5 transition-transform ${rightSidebarOpen ? 'rotate-180' : ''}`} />
      </Button>
    </>
  );
};