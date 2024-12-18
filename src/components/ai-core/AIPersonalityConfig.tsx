import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Brain, Code, User, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/types/database/json";

interface MemoryType {
  id: string;
  label: string;
  icon: typeof Brain;
  enabled: boolean;
}

interface PersonalitySettings {
  friendliness: number;
  assertiveness: number;
  technicalDetail: number;
}

type AISettingsValue = {
  personality: {
    friendliness: number;
    assertiveness: number;
    technicalDetail: number;
  };
  memoryTypes: Array<{
    id: string;
    label: string;
    enabled: boolean;
  }>;
}

export const AIPersonalityConfig = () => {
  const { toast } = useToast();
  const [personality, setPersonality] = useState<PersonalitySettings>({
    friendliness: 50,
    assertiveness: 30,
    technicalDetail: 70,
  });

  const [memoryTypes, setMemoryTypes] = useState<MemoryType[]>([
    { id: 'work', label: 'Work', icon: Brain, enabled: true },
    { id: 'code', label: 'Code', icon: Code, enabled: true },
    { id: 'personal', label: 'Personal', icon: User, enabled: false },
    { id: 'social', label: 'Social', icon: Users, enabled: false },
  ]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('value')
        .eq('user_id', session.user.id)
        .eq('key', 'personality_settings')
        .single();

      if (error) throw error;

      if (data?.value) {
        const settings = data.value as AISettingsValue;
        if (settings.personality) {
          setPersonality(settings.personality);
        }
        if (settings.memoryTypes) {
          // Map the stored memory types back to our interface with icons
          const updatedMemoryTypes = memoryTypes.map(type => ({
            ...type,
            enabled: settings.memoryTypes.find(m => m.id === type.id)?.enabled ?? type.enabled
          }));
          setMemoryTypes(updatedMemoryTypes);
        }
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save settings",
          variant: "destructive"
        });
        return;
      }

      // Prepare the value object with the correct shape for JSON storage
      const settingsValue: AISettingsValue = {
        personality: {
          friendliness: personality.friendliness,
          assertiveness: personality.assertiveness,
          technicalDetail: personality.technicalDetail,
        },
        memoryTypes: memoryTypes.map(({ id, label, enabled }) => ({
          id,
          label,
          enabled,
        })),
      };

      const { error } = await supabase
        .from('ai_settings')
        .upsert({
          key: 'personality_settings',
          user_id: session.user.id,
          value: settingsValue as Json,
          metadata: {
            lastUpdated: new Date().toISOString(),
            version: '1.0'
          } as Json,
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "AI personality settings have been updated"
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: "Failed to save AI personality settings",
        variant: "destructive"
      });
    }
  };

  const toggleMemoryType = (id: string) => {
    setMemoryTypes(prev => prev.map(type => 
      type.id === id ? { ...type, enabled: !type.enabled } : type
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 mt-4 space-y-6"
    >
      <h3 className="text-xl font-semibold mb-4">AI Personality Settings</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Friendliness ({personality.friendliness}%)</Label>
          <Slider
            value={[personality.friendliness]}
            max={100}
            step={1}
            onValueChange={([value]) => setPersonality(prev => ({ ...prev, friendliness: value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Assertiveness ({personality.assertiveness}%)</Label>
          <Slider
            value={[personality.assertiveness]}
            max={100}
            step={1}
            onValueChange={([value]) => setPersonality(prev => ({ ...prev, assertiveness: value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Technical Detail Level ({personality.technicalDetail}%)</Label>
          <Slider
            value={[personality.technicalDetail]}
            max={100}
            step={1}
            onValueChange={([value]) => setPersonality(prev => ({ ...prev, technicalDetail: value }))}
          />
        </div>

        <div className="space-y-4">
          <Label>Memory Types</Label>
          <div className="grid grid-cols-2 gap-4">
            {memoryTypes.map(type => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="flex items-center justify-between p-3 glass-card">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-neon-blue" />
                    <span>{type.label}</span>
                  </div>
                  <Switch
                    checked={type.enabled}
                    onCheckedChange={() => toggleMemoryType(type.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Button onClick={saveSettings} className="w-full">
          Save Settings
        </Button>
      </div>
    </motion.div>
  );
};