import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FileBar } from "@/components/layout/FileBar";
import { StatusBar } from "@/components/layout/StatusBar";
import { TopBar } from "@/components/layout/TopBar";
import { TabBar } from "@/components/layout/TabBar";
import { AIAssistant } from "@/components/ai-elements/AIAssistant";
import { useLayoutStore } from "@/stores";
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
    <div className="h-screen w-full bg-dark-darker overflow-hidden">
      <AIAssistant />
      
      {/* Fixed Top Bar */}
      {topBarVisible && (
        <div className="fixed top-0 left-0 right-0 z-30">
          <TopBar />
          <TabBar />
        </div>
      )}

      {/* Main Content Area with Sidebars */}
      <div className="flex h-full">
        {/* Left FileBar */}
        <div className={cn(
          "fixed left-0 z-20 w-12",
          topBarVisible ? "top-24" : "top-0",
          bottomBarVisible ? "bottom-8" : "bottom-0"
        )}>
          <FileBar position="left" />
        </div>

        {/* Main Resizable Content */}
        <div className={cn(
          "flex-1 ml-12 mr-12",
          topBarVisible ? "mt-24" : "mt-0",
          bottomBarVisible ? "mb-8" : "mb-0"
        )}>
          <ResizablePanelGroup direction="horizontal">
            {sidebarOpen && (
              <>
                <ResizablePanel 
                  defaultSize={sidebarWidth} 
                  minSize={15} 
                  maxSize={30}
                  onResize={setSidebarWidth}
                  className="glass-card border-r border-white/5"
                >
                  <Sidebar />
                </ResizablePanel>
                <ResizableHandle />
              </>
            )}

            <ResizablePanel>
              <main className="h-full custom-scrollbar overflow-y-auto px-4">
                <Outlet />
              </main>
            </ResizablePanel>

            {rightSidebarOpen && (
              <>
                <ResizableHandle />
                <ResizablePanel 
                  defaultSize={rightSidebarWidth}
                  minSize={15} 
                  maxSize={30}
                  onResize={setRightSidebarWidth}
                  className="glass-card border-l border-white/5"
                >
                  <div className="h-full">
                    {/* Right sidebar content */}
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>

        {/* Right FileBar */}
        <div className={cn(
          "fixed right-0 z-20 w-12",
          topBarVisible ? "top-24" : "top-0",
          bottomBarVisible ? "bottom-8" : "bottom-0"
        )}>
          <FileBar position="right" />
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      {bottomBarVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-30 h-8">
          <StatusBar />
        </div>
      )}
    </div>
  );
};