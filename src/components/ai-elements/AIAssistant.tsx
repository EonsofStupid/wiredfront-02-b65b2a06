import { useEffect } from 'react';
import { useMessageQueue } from '@/stores/messageQueue';
import { useToast } from '@/components/ui/use-toast';
import { AICore } from '../ai-core/AICore';
import { useAIStore } from '@/stores/ai';

export const AIAssistant = () => {
  const { initializeWorker, messages, error } = useMessageQueue();
  const { toast } = useToast();
  const isVisible = useAIStore((state) => state.isVisible);

  useEffect(() => {
    initializeWorker();
  }, [initializeWorker]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Message Processing Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (!isVisible) return null;

  return <AICore />;
};