import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Eye, Globe, Bot, Link } from "lucide-react";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { AISettings } from "@/components/settings/AISettings";
import { DiscordBotSettings } from "@/components/settings/DiscordBotSettings";
import { RouteSettings } from "@/components/settings/RouteSettings";
import { RouteLogger } from "@/components/settings/RouteLogger";

export default function Settings() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">
            <Link className="h-4 w-4 mr-2" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Globe className="h-4 w-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="discord">
            <Bot className="h-4 w-4 mr-2" />
            Discord Bot
          </TabsTrigger>
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="accessibility">
            <Eye className="h-4 w-4 mr-2" />
            Accessibility
          </TabsTrigger>
        </TabsList>

        <Card className="p-6 bg-[#1A1F2C] border-purple-500/20">
          <TabsContent value="routes">
            <div className="space-y-6">
              <RouteSettings />
              <RouteLogger />
            </div>
          </TabsContent>
          <TabsContent value="ai">
            <AISettings />
          </TabsContent>
          <TabsContent value="discord">
            <DiscordBotSettings />
          </TabsContent>
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="accessibility">
            <AccessibilitySettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}