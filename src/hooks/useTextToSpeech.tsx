import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AISettingsMetadata, isAISettingsMetadata } from '@/types/ai-settings';

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const speak = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { data: settings, error: settingsError } = await supabase
        .from('ai_settings')
        .select('metadata')
        .eq('user_id', session.user.id)
        .single();

      if (settingsError) throw settingsError;

      const metadata = settings?.metadata;
      if (!isAISettingsMetadata(metadata)) {
        throw new Error('Invalid AI settings metadata format');
      }

      const apiKey = metadata.elevenLabsApiKey;
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please add your ElevenLabs API key in settings",
          variant: "destructive"
        });
        return;
      }

      setIsSpeaking(true);

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error: any) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Speech Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    speak,
    isLoading,
    isSpeaking
  };
};