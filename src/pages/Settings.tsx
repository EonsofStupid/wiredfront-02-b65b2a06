import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AISettings } from "@/components/settings/AISettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { DiscordBotSettings } from "@/components/settings/DiscordBotSettings";
import { SetupWizard } from "@/components/settings/setup-wizard/SetupWizard";

export default function Settings() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and configurations
        </p>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList>
          <TabsTrigger value="setup">Setup Wizard</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="discord">Discord Bot</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <SetupWizard />
        </TabsContent>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="ai">
          <AISettings />
        </TabsContent>

        <TabsContent value="discord">
          <DiscordBotSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="accessibility">
          <AccessibilitySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}