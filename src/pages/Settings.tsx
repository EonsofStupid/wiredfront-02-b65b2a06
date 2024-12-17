import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AISettings } from "@/components/settings/AISettings";
import { ThemeManager } from "@/components/settings/ThemeManager";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { APIKeySettings } from "@/components/settings/APIKeySettings";
import { RouteSettings } from "@/components/settings/RouteSettings";
import { DiscordBotSettings } from "@/components/settings/DiscordBotSettings";

const Settings = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold gradient-text">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="themes">
            <ThemeManager />
          </TabsContent>
          
          <TabsContent value="ai">
            <AISettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="accessibility">
            <AccessibilitySettings />
          </TabsContent>
          
          <TabsContent value="api">
            <APIKeySettings />
          </TabsContent>
          
          <TabsContent value="routes">
            <RouteSettings />
          </TabsContent>
          
          <TabsContent value="discord">
            <DiscordBotSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;