import { create } from 'zustand';

interface BufferedMessage {
  id: string;
  content: string;
  timestamp: number;
  status: 'pending' | 'processed' | 'error';
}

interface MessageBufferStore {
  messages: BufferedMessage[];
  worker: Worker | null;
  isInitialized: boolean;
  addMessage: (message: Omit<BufferedMessage, 'status'>) => void;
  initializeWorker: () => void;
  clearBuffer: () => void;
}

export const useMessageBuffer = create<MessageBufferStore>((set, get) => ({
  messages: [],
  worker: null,
  isInitialized: false,

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
    };

    set((state) => ({
      messages: [...state.messages, bufferedMessage],
    }));

    get().worker?.postMessage({
      type: 'ADD_MESSAGE',
      payload: bufferedMessage,
    });
  },

  clearBuffer: () => {
    get().worker?.postMessage({ type: 'CLEAR_QUEUE' });
    set({ messages: [] });
  },
}));