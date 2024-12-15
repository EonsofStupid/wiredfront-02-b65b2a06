import { Home, Settings, FileText, Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAIStore } from "@/stores";

export const MobileNavigation = () => {
  const location = useLocation();
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Dashboard", path: "/dashboard" },
    { icon: Bot, label: "AI", path: "", onClick: toggleAI },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="h-16 glass-card border-t border-white/10">
      <div className="h-full flex items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          const content = (
            <div className={cn(
              "flex flex-col items-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="focus:outline-none"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className="focus:outline-none"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};