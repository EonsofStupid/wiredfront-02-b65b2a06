import { useEffect } from 'react';
import { useMessageQueue } from '../stores/messageQueue';
import { useToast } from '@/components/ui/use-toast';

export const useMessageProcessor = () => {
  const { initializeWorker, messages, error } = useMessageQueue();
  const { toast } = useToast();

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

  return {
    pendingMessages: messages.filter(m => m.status === 'pending'),
    processingMessages: messages.filter(m => m.status === 'processing'),
    completedMessages: messages.filter(m => m.status === 'completed'),
    failedMessages: messages.filter(m => m.status === 'failed'),
    totalMessages: messages.length
  };
};