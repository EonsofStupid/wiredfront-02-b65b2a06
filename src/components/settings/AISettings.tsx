import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIPersonalitySettings } from "./ai/AIPersonalitySettings";
import { AITrainingSettings } from "./ai/AITrainingSettings";
import { AIFeatureSettings } from "./ai/AIFeatureSettings";
import { AIProviderSelector } from "../ai-elements/AIProviderSelector";
import { supabase } from "@/integrations/supabase/client";
import type { AIProvider } from "@/types/ai";

export function AISettings() {
  const [availableProviders, setAvailableProviders] = useState<AIProvider[]>([]);

  useEffect(() => {
    fetchAvailableProviders();
  }, []);

  const fetchAvailableProviders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('provider')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .not('api_key', 'is', null);

      if (error) throw error;

      const providers = data.map(item => item.provider as AIProvider);
      setAvailableProviders(providers);
    } catch (error) {
      console.error('Error fetching available providers:', error);
    }
  };

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
            availableProviders={availableProviders}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}