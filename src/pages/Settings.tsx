import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AISettings } from "@/components/settings/AISettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { DiscordBotSettings } from "@/components/settings/DiscordBotSettings";
import { SetupWizard } from "@/components/settings/setup-wizard/SetupWizard";
import { ProjectSetup } from "@/components/settings/setup-wizard/ProjectSetup";
import { AIModelManagement } from "@/components/settings/ai/AIModelManagement";
import { APIKeySettings } from "@/components/settings/APIKeySettings";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PageErrorBoundary } from "@/components/shared/PageErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsSkeleton = () => (
  <div className="space-y-8">
    <div className="glass-card p-6 border border-white/10 shadow-xl">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="glass-card p-6 border border-white/10 shadow-xl">
      <Skeleton className="h-10 w-full mb-6" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  </div>
);

const SettingsContent = () => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "space-y-8 min-h-full bg-gradient-to-b from-[#1A1F2C] to-[#2D3344]",
      isMobile ? "p-0" : "container mx-auto py-6"
    )}>
      <div className="glass-card p-6 border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 gradient-text animate-gradient-x">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and configurations
        </p>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className={cn(
          "glass-card p-1",
          isMobile ? "flex flex-wrap gap-2" : "space-x-2"
        )}>
          <TabsTrigger value="setup">Setup Wizard</TabsTrigger>
          <TabsTrigger value="project">Project Setup</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="ai-models">AI Models</TabsTrigger>
          <TabsTrigger value="discord">Discord Bot</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <div className="glass-card p-6 border border-white/10 shadow-xl backdrop-blur-lg">
          <TabsContent value="setup" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <SetupWizard />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="project" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <ProjectSetup />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="general" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <GeneralSettings />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="api-keys" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <APIKeySettings />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <AISettings />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="ai-models" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <AIModelManagement />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="discord" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <DiscordBotSettings />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <NotificationSettings />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="accessibility" className="mt-0">
            <ErrorBoundary FallbackComponent={PageErrorBoundary}>
              <AccessibilitySettings />
            </ErrorBoundary>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default function Settings() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <ErrorBoundary FallbackComponent={PageErrorBoundary}>
          <React.Suspense fallback={<SettingsSkeleton />}>
            <SettingsContent />
          </React.Suspense>
        </ErrorBoundary>
      </SettingsProvider>
    </QueryClientProvider>
  );
}