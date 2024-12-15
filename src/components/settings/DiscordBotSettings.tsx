import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Bot, Settings, Quote, Trophy, Shield } from "lucide-react";
import { BotGeneralSettings } from "./discord/BotGeneralSettings";
import { BotAISettings } from "./discord/BotAISettings";
import { BotMonitor } from "./discord/BotMonitor";

export const DiscordBotSettings = () => {
  return (
    <div className="space-y-6">
      <BotMonitor />
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Bot className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="quotes">
            <Quote className="h-4 w-4 mr-2" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="moderation">
            <Shield className="h-4 w-4 mr-2" />
            Moderation
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <TabsContent value="general">
            <BotGeneralSettings />
          </TabsContent>
          
          <TabsContent value="ai">
            <BotAISettings />
          </TabsContent>
          
          <TabsContent value="quotes">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quote Management</h3>
              <p className="text-gray-500">
                Configure quote categories, tags, and moderation settings.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Achievement System</h3>
              <p className="text-gray-500">
                Manage badges, achievements, and user progression.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="moderation">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Moderation Tools</h3>
              <p className="text-gray-500">
                Configure auto-moderation rules and AI-powered content filtering.
              </p>
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};