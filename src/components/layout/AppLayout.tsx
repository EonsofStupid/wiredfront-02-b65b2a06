import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FileBar } from "@/components/layout/FileBar";
import { StatusBar } from "@/components/layout/StatusBar";
import { TopBar } from "@/components/layout/TopBar";
import { AIAssistant } from "@/components/ai-elements/AIAssistant";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <AnimatedBackground />
      <AIAssistant />
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex-1 flex relative overflow-hidden">
          <FileBar position="left" />
          <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
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
    </div>
  );
};