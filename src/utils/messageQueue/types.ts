export interface QueuedMessage {
  id: string;
  content: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retries?: number;
}

export interface MessageQueueState {
  messages: QueuedMessage[];
  isProcessing: boolean;
  error: string | null;
}

export type MessageWorkerAction = 
  | { type: 'ENQUEUE_MESSAGE'; payload: Omit<QueuedMessage, 'status'> }
  | { type: 'PROCESS_COMPLETE'; payload: { id: string; result?: any } }
  | { type: 'PROCESS_ERROR'; payload: { id: string; error: string } }
  | { type: 'CLEAR_QUEUE' };