import { useEffect, useState, memo } from 'react';
import { useToast } from '@/components/ui/use-toast';

const PREVIEW_PORT = 8081;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const LivePreview = memo(() => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    let retryCount = 0;
    let timeoutId: NodeJS.Timeout;

    const checkPreviewServer = async () => {
      try {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const url = `${protocol}//${hostname}:${PREVIEW_PORT}`;
        
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          setPreviewUrl(url);
        } else {
          throw new Error('Preview server not ready');
        }
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          timeoutId = setTimeout(checkPreviewServer, RETRY_DELAY);
        } else {
          toast({
            title: "Preview Connection Error",
            description: "Could not connect to preview server. Please refresh the page.",
            variant: "destructive",
          });
        }
      }
    };

    checkPreviewServer();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [toast]);

  if (!previewUrl) {
    return null;
  }

  return (
    <div className="preview-container">
      <iframe
        src={previewUrl}
        className="w-full h-full border-0"
        title="Live Preview"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
});

LivePreview.displayName = 'LivePreview';