import { QueuedMessage, MessageWorkerAction } from '../utils/messageQueue/types';

const messageQueue: QueuedMessage[] = [];
let isProcessing = false;
const MAX_RETRIES = 3;
const BATCH_SIZE = 10;
const PROCESS_INTERVAL = 1000;

const processQueue = async () => {
  if (isProcessing || messageQueue.length === 0) return;
  
  isProcessing = true;
  const batch = messageQueue.splice(0, BATCH_SIZE);
  
  try {
    await Promise.all(
      batch.map(async (message) => {
        try {
          message.status = 'processing';
          // Simulate processing time (replace with actual processing logic)
          await new Promise(resolve => setTimeout(resolve, 100));
          
          self.postMessage({
            type: 'PROCESS_COMPLETE',
            payload: { id: message.id }
          });
        } catch (error) {
          const retries = (message.retries || 0) + 1;
          
          if (retries < MAX_RETRIES) {
            message.retries = retries;
            messageQueue.unshift({ ...message, status: 'pending' });
          } else {
            self.postMessage({
              type: 'PROCESS_ERROR',
              payload: { 
                id: message.id, 
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            });
          }
        }
      })
    );
  } catch (error) {
    console.error('Batch processing error:', error);
  } finally {
    isProcessing = false;
    if (messageQueue.length > 0) {
      setTimeout(processQueue, PROCESS_INTERVAL);
    }
  }
};

self.addEventListener('message', (event: MessageEvent<MessageWorkerAction>) => {
  const { type } = event.data;
  
  switch (type) {
    case 'ENQUEUE_MESSAGE':
      messageQueue.push({
        ...event.data.payload,
        status: 'pending'
      });
      processQueue();
      break;
      
    case 'CLEAR_QUEUE':
      messageQueue.length = 0;
      isProcessing = false;
      break;
      
    default:
      break;
  }
});