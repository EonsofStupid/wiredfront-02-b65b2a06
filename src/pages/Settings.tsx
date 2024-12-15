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
      <div className="container mx-auto py-6 space-y-8 min-h-full bg-gradient-to-b from-[#1A1F2C] to-[#2D3344]">
        <div className="glass-card p-6 border border-white/10 shadow-xl">
          <h1 className="text-3xl font-bold mb-2 gradient-text animate-gradient-x">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and configurations
          </p>
        </div>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="glass-card p-1 space-x-2">
            <TabsTrigger 
              value="setup" 
              className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:text-white transition-all"
            >
              Setup Wizard
            </TabsTrigger>
            <TabsTrigger 
              value="general" 
              className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:text-white transition-all"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:text-white transition-all"
            >
              AI
            </TabsTrigger>
            <TabsTrigger 
              value="discord" 
              className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:text-white transition-all"
            >
              Discord Bot
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:text-white transition-all"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="accessibility" 
              className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white hover:text-white transition-all"
            >
              Accessibility
            </TabsTrigger>
          </TabsList>

          <div className="glass-card p-6 border border-white/10 shadow-xl backdrop-blur-lg">
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