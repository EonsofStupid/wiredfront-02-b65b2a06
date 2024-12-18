import { create } from 'zustand';
import { MessageQueueState, QueuedMessage } from '../utils/messageQueue/types';

let worker: Worker | null = null;

const initialState: MessageQueueState = {
  messages: [],
  isProcessing: false,
  error: null
};

export const useMessageQueue = create<MessageQueueState & {
  initializeWorker: () => void;
  enqueueMessage: (content: string) => void;
  clearQueue: () => void;
}>((set, get) => ({
  ...initialState,

  initializeWorker: () => {
    if (worker) return;

    worker = new Worker(
      new URL('../workers/messageWorker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event) => {
      const { type, payload } = event.data;
      
      switch (type) {
        case 'PROCESS_COMPLETE':
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === payload.id
                ? { ...msg, status: 'completed' as const }
                : msg
            ),
            isProcessing: state.messages.some((msg) => msg.status === 'processing')
          }));
          break;
          
        case 'PROCESS_ERROR':
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === payload.id
                ? { ...msg, status: 'failed' as const }
                : msg
            ),
            error: payload.error
          }));
          break;
      }
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      set({ error: error.message });
    };
  },

  enqueueMessage: (content: string) => {
    if (!worker) return;

    const message: Omit<QueuedMessage, 'status'> = {
      id: crypto.randomUUID(),
      content,
      timestamp: Date.now()
    };

    worker.postMessage({
      type: 'ENQUEUE_MESSAGE',
      payload: message
    });

    set((state) => ({
      messages: [...state.messages, { ...message, status: 'pending' }]
    }));
  },

  clearQueue: () => {
    if (!worker) return;
    
    worker.postMessage({ type: 'CLEAR_QUEUE' });
    set(initialState);
  }
}));