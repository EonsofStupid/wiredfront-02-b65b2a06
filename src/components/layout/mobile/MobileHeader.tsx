import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLayoutStore } from "@/stores";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const MobileHeader = () => {
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <header className="h-14 glass-card border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="text-lg font-semibold gradient-text">
          wiredFRONT
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              await supabase.auth.signOut();
            }}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};