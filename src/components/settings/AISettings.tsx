import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIPersonalitySettings } from "./ai/AIPersonalitySettings";
import { AITrainingSettings } from "./ai/AITrainingSettings";
import { AIFeatureSettings } from "./ai/AIFeatureSettings";
import { AIProviderSelector } from "../ai-elements/AIProviderSelector";

export function AISettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Configuration</h2>
        <p className="text-muted-foreground">
          Customize your AI assistant's behavior and capabilities
        </p>
      </div>

      <Tabs defaultValue="personality" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="provider">Provider</TabsTrigger>
        </TabsList>

        <TabsContent value="personality">
          <AIPersonalitySettings />
        </TabsContent>

        <TabsContent value="training">
          <AITrainingSettings />
        </TabsContent>

        <TabsContent value="features">
          <AIFeatureSettings />
        </TabsContent>

        <TabsContent value="provider">
          <AIProviderSelector
            provider="gemini"
            onProviderChange={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}