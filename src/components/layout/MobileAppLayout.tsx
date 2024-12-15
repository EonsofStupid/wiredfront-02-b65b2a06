import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppLayout } from "./AppLayout";
import { MobileNavigation } from "./mobile/MobileNavigation";
import { MobileHeader } from "./mobile/MobileHeader";
import { useLayoutStore } from "@/stores";

export const MobileAwareLayout = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <AppLayout />;
  }

  return (
    <div className="flex flex-col h-screen bg-dark">
      <MobileHeader />
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>
      <MobileNavigation />
    </div>
  );
};