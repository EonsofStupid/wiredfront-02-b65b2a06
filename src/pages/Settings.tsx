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

export default function Settings() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <div className="container mx-auto py-6 space-y-8 min-h-full bg-gradient-to-b from-[#1A1F2C] to-[#2D3344]">
          <div className="glass-card p-6 border border-white/10 shadow-xl">
            <h1 className="text-3xl font-bold mb-2 gradient-text animate-gradient-x">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application preferences and configurations
            </p>
          </div>

          <Tabs defaultValue="setup" className="space-y-6">
            <TabsList className="glass-card p-1 space-x-2">
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
                <SetupWizard />
              </TabsContent>

              <TabsContent value="project" className="mt-0">
                <ProjectSetup />
              </TabsContent>

              <TabsContent value="general" className="mt-0">
                <GeneralSettings />
              </TabsContent>

              <TabsContent value="api-keys" className="mt-0">
                <APIKeySettings />
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <AISettings />
              </TabsContent>

              <TabsContent value="ai-models" className="mt-0">
                <AIModelManagement />
              </TabsContent>

              <TabsContent value="discord" className="mt-0">
                <DiscordBotSettings />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <NotificationSettings />
              </TabsContent>

              <TabsContent value="accessibility" className="mt-0">
                <AccessibilitySettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SettingsProvider>
    </QueryClientProvider>
  );
}