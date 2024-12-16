import { SidebarControls } from "./top-bar/SidebarControls";
import { Logo } from "./top-bar/Logo";
import { NavigationButtons } from "./top-bar/NavigationButtons";
import { UserMenu } from "./top-bar/UserMenu";

export const TopBar = () => {
  return (
    <div className="top-bar glass-card border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarControls />
        <Logo />
        <NavigationButtons />
      </div>
      
      <UserMenu />
    </div>
  );
};