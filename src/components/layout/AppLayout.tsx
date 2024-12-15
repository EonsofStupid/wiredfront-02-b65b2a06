import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FileBar } from "@/components/layout/FileBar";
import { StatusBar } from "@/components/layout/StatusBar";
import { TopBar } from "@/components/layout/TopBar";
import { AIAssistant } from "@/components/ai-elements/AIAssistant";
import { useLayoutStore } from "@/stores/layout";
import { cn } from "@/lib/utils";

export const AppLayout = () => {
  const {
    sidebarOpen,
    rightSidebarOpen,
    topBarVisible,
    bottomBarVisible,
    sidebarWidth,
    rightSidebarWidth,
    setSidebarWidth,
    setRightSidebarWidth,
  } = useLayoutStore();

  return (
    <div className="app-layout">
      <AIAssistant />
      <div className="flex flex-col h-screen">
        {topBarVisible && <TopBar />}
        <div className="flex-1 flex relative overflow-hidden">
          <FileBar position="left" />
          <ResizablePanelGroup 
            direction="horizontal" 
            className={cn(
              "min-h-0 flex-1",
              !sidebarOpen && "pl-0",
              !rightSidebarOpen && "pr-0"
            )}
          >
            <ResizablePanel 
              defaultSize={sidebarWidth} 
              minSize={15} 
              maxSize={30}
              onResize={(size) => setSidebarWidth(size)}
              className={cn(!sidebarOpen && "hidden")}
            >
              <Sidebar />
            </ResizablePanel>
            {sidebarOpen && <ResizableHandle />}
            <ResizablePanel>
              <main className="h-full overflow-auto">
                <Outlet />
              </main>
            </ResizablePanel>
            {rightSidebarOpen && <ResizableHandle />}
            {rightSidebarOpen && (
              <ResizablePanel 
                defaultSize={rightSidebarWidth}
                minSize={15} 
                maxSize={30}
                onResize={(size) => setRightSidebarWidth(size)}
              >
                <div className="h-full bg-sidebar">
                  {/* Right sidebar content */}
                </div>
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
          <FileBar position="right" />
        </div>
        {bottomBarVisible && <StatusBar />}
      </div>
    </div>
  );
};