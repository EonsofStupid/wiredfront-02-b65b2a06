import { Circle } from "lucide-react";
import { useLayoutStore } from "@/stores/layout";

export const StatusBar = () => {
  const { sidebarOpen, rightSidebarOpen } = useLayoutStore();

  return (
    <div className="status-bar">
      <div className="relative z-10 h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-xs">
          <Circle className="h-2 w-2 text-green-500 fill-current" />
          <span>Ready</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">
            Layout: {sidebarOpen ? 'Left' : ''} {rightSidebarOpen ? 'Right' : ''} Sidebar
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span>JavaScript</span>
        </div>
      </div>
      <div className="data-stream" />
    </div>
  );
};