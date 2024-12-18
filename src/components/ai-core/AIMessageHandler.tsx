import React from 'react';
import { useMessageQueue } from '@/stores/messageQueue';
import { useMessageProcessor } from '@/hooks/useMessageProcessor';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const AIMessageHandler = () => {
  const { enqueueMessage, clearQueue } = useMessageQueue();
  const { 
    pendingMessages, 
    processingMessages,
    completedMessages,
    failedMessages,
    totalMessages 
  } = useMessageProcessor();

  const handleSendMessage = () => {
    enqueueMessage(`Test message ${Date.now()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={handleSendMessage}>
          Send Test Message
        </Button>
        <Button variant="destructive" onClick={clearQueue}>
          Clear Queue
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-secondary">
          <h3 className="font-semibold mb-2">Queue Status</h3>
          <div className="space-y-2 text-sm">
            <p>Pending: {pendingMessages.length}</p>
            <p>Processing: {processingMessages.length}</p>
            <p>Completed: {completedMessages.length}</p>
            <p>Failed: {failedMessages.length}</p>
            <p>Total: {totalMessages}</p>
          </div>
        </div>

        {(pendingMessages.length > 0 || processingMessages.length > 0) && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};