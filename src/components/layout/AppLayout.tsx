import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FileBar } from "@/components/layout/FileBar";
import { StatusBar } from "@/components/layout/StatusBar";
import { TopBar } from "@/components/layout/TopBar";
import { AIAssistant } from "@/components/ai-elements/AIAssistant";

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <AIAssistant />
      <TopBar />
      <div className="app-content">
        <FileBar position="left" />
        <ResizablePanelGroup direction="horizontal" className="main-content">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80}>
            <main className="h-full overflow-auto">
              <Outlet />
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
        <FileBar position="right" />
      </div>
      <StatusBar />
    </div>
  );
};