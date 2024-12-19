export { useProviderStore } from './provider';
export { useInterfaceStore } from './interface';
export { usePersonalityStore } from './personality';

// Root selector hooks for common operations
export const useAIReady = () => {
  const isConfigured = useProviderStore((state) => state.isConfigured);
  const personality = usePersonalityStore((state) => state.currentPersonality);
  return isConfigured && personality !== null;
};

export const useAIProcessing = () => {
  const isProcessing = useInterfaceStore((state) => state.isProcessing);
  const isLoading = usePersonalityStore((state) => state.isLoading);
  return isProcessing || isLoading;
};