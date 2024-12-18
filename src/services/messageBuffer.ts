import { create } from 'zustand';

interface BufferedMessage {
  id: string;
  content: string;
  timestamp: number;
  status: 'pending' | 'processed' | 'error';
  retryCount?: number;
}

interface MessageBufferStore {
  messages: BufferedMessage[];
  worker: Worker | null;
  isInitialized: boolean;
  isOnline: boolean;
  addMessage: (message: Omit<BufferedMessage, 'status'>) => void;
  initializeWorker: () => void;
  clearBuffer: () => void;
  setOnlineStatus: (status: boolean) => void;
  retryFailedMessages: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const useMessageBuffer = create<MessageBufferStore>((set, get) => ({
  messages: [],
  worker: null,
  isInitialized: false,
  isOnline: navigator.onLine,

  initializeWorker: () => {
    if (get().isInitialized) return;

    const worker = new Worker(
      new URL('../workers/messageWorker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event) => {
      const { type, payload } = event.data;
      
      switch (type) {
        case 'BATCH_PROCESSED':
          set((state) => ({
            messages: state.messages.map((msg) =>
              payload.find((p: BufferedMessage) => p.id === msg.id)
                ? { ...msg, status: 'processed' }
                : msg
            ),
          }));
          break;
          
        case 'ERROR':
          console.error('Message worker error:', payload);
          break;
      }
    };

    set({ worker, isInitialized: true });
  },

  addMessage: (message) => {
    const bufferedMessage: BufferedMessage = {
      ...message,
      status: 'pending',
      retryCount: 0,
    };

    set((state) => ({
      messages: [...state.messages, bufferedMessage],
    }));

    if (get().isOnline) {
      get().worker?.postMessage({
        type: 'ADD_MESSAGE',
        payload: bufferedMessage,
      });
    }
  },

  setOnlineStatus: (status: boolean) => {
    set({ isOnline: status });
    if (status) {
      get().retryFailedMessages();
    }
  },

  retryFailedMessages: () => {
    const { messages, worker } = get();
    const failedMessages = messages.filter(
      (msg) => msg.status === 'error' && (msg.retryCount || 0) < MAX_RETRIES
    );

    failedMessages.forEach((msg) => {
      setTimeout(() => {
        const updatedMessage = {
          ...msg,
          retryCount: (msg.retryCount || 0) + 1,
          status: 'pending' as const,
        };

        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === msg.id ? updatedMessage : m
          ),
        }));

        worker?.postMessage({
          type: 'ADD_MESSAGE',
          payload: updatedMessage,
        });
      }, RETRY_DELAY * (msg.retryCount || 0));
    });
  },

  clearBuffer: () => {
    get().worker?.postMessage({ type: 'CLEAR_QUEUE' });
    set({ messages: [] });
  },
}));