import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreviewState {
  isPreviewOpen: boolean;
  previewUrl: string;
  togglePreview: () => void;
  setPreviewUrl: (url: string) => void;
}

export const usePreviewStore = create<PreviewState>()(
  persist(
    (set) => ({
      isPreviewOpen: false,
      previewUrl: 'http://localhost:8081',
      togglePreview: () => set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),
      setPreviewUrl: (url: string) => set({ previewUrl: url }),
    }),
    {
      name: 'preview-storage',
    }
  )
);