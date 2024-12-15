import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AISettings } from "@/components/settings/AISettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { DiscordBotSettings } from "@/components/settings/DiscordBotSettings";
import { SetupWizard } from "@/components/settings/setup-wizard/SetupWizard";
import { SettingsProvider } from "@/contexts/SettingsContext";

export default function Settings() {
  return (
    <SettingsProvider>
      <div className="container mx-auto py-6 space-y-8 min-h-full bg-[#1A1F2C]">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and configurations
          </p>
        </div>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="glass-card p-1 space-x-2">
            <TabsTrigger value="setup" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
              Setup Wizard
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
              General
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
              AI
            </TabsTrigger>
            <TabsTrigger value="discord" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
              Discord Bot
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
              Accessibility
            </TabsTrigger>
          </TabsList>

          <div className="glass-card p-6">
            <TabsContent value="setup" className="mt-0">
              <SetupWizard />
            </TabsContent>

            <TabsContent value="general" className="mt-0">
              <GeneralSettings />
            </TabsContent>

            <TabsContent value="ai" className="mt-0">
              <AISettings />
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
  );
}