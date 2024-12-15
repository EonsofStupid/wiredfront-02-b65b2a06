import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  File, 
  Settings, 
  Image, 
  Bot, 
  Menu, 
  Search, 
  Bell, 
  User,
  PanelLeftClose,
  PanelRightClose 
} from "lucide-react";
import { useAIStore, useLayoutStore } from "@/stores";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const TopBar = () => {
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);
  const { 
    sidebarOpen, 
    rightSidebarOpen,
    toggleSidebar, 
    toggleRightSidebar 
  } = useLayoutStore();

  return (
    <div className="top-bar glass-card border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="nav-button"
              >
                {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Link to="/" className="text-lg font-semibold gradient-text">
          wiredFRONT
        </Link>
        
        <div className="flex items-center gap-2">
          <Link to="/files">
            <Button variant="ghost" size="icon" className="nav-button">
              <File className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAI}
            className="nav-button"
          >
            <Bot className="h-4 w-4" />
          </Button>
          <Link to="/media">
            <Button variant="ghost" size="icon" className="nav-button">
              <Image className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="nav-button">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="nav-button">
          <Bell className="h-5 w-5" />
        </Button>
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="nav-button">
            <User className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="nav-button">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleRightSidebar}
                className="nav-button"
              >
                <PanelRightClose className={`h-5 w-5 transition-transform ${rightSidebarOpen ? 'rotate-180' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{rightSidebarOpen ? 'Hide Right Sidebar' : 'Show Right Sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};