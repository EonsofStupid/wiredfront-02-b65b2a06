import { SidebarControls } from "./top-bar/SidebarControls";
import { Logo } from "./top-bar/Logo";
import { NavigationButtons } from "./top-bar/NavigationButtons";
import { UserMenu } from "./top-bar/UserMenu";

export const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="relative z-10 h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarControls />
          <Logo />
          <NavigationButtons />
        </div>
        
        <UserMenu />
      </div>
      <div className="data-stream" />
    </div>
  );
};