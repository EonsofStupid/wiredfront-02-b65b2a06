import { Button } from "@/components/ui/button";
import { Search, Bell, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="nav-button">
        <Search className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="nav-button">
        <Bell className="h-5 w-5" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="nav-button">
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

      <Link to="/settings">
        <Button variant="ghost" size="icon" className="nav-button">
          <Settings className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};