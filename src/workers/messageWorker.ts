const messageQueue: any[] = [];
let isProcessing = false;

// Process messages in batches
const processMessageQueue = async () => {
  if (isProcessing || messageQueue.length === 0) return;
  
  isProcessing = true;
  const batch = messageQueue.splice(0, 50); // Process 50 messages at a time
  
  try {
    // Process the batch and post back to main thread
    self.postMessage({ type: 'BATCH_PROCESSED', payload: batch });
  } catch (error) {
    self.postMessage({ type: 'ERROR', payload: error });
  } finally {
    isProcessing = false;
    if (messageQueue.length > 0) {
      processMessageQueue();
    }
  }
};

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'ADD_MESSAGE':
      messageQueue.push(payload);
      processMessageQueue();
      break;
      
    case 'CLEAR_QUEUE':
      messageQueue.length = 0;
      break;
      
    default:
      break;
  }
});