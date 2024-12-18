import { useEffect, useState, memo } from 'react';
import { useToast } from '@/components/ui/use-toast';

const PREVIEW_PORT = 8081;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const DevPreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string>(`http://localhost:${PREVIEW_PORT}`);
  const { toast } = useToast();

  useEffect(() => {
    const checkPreviewServer = async () => {
      try {
        const response = await fetch(previewUrl, { method: 'HEAD' });
        if (!response.ok) {
          toast({
            title: "Preview Connection Error",
            description: "Could not connect to preview server",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Preview Connection Error",
          description: "Could not connect to preview server",
          variant: "destructive",
        });
      }
    };

    checkPreviewServer();
  }, [previewUrl, toast]);

  return (
    <div className="w-full h-screen bg-[#1A1F2C] flex flex-col">
      <div className="w-full h-8 bg-gray-800 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <input 
          type="text" 
          value={previewUrl}
          onChange={(e) => setPreviewUrl(e.target.value)}
          className="ml-4 bg-transparent text-sm text-gray-300 focus:outline-none flex-1"
        />
      </div>
      <iframe
        src={previewUrl}
        className="w-full h-[calc(100%-2rem)] border-0"
        title="Development Preview"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
};

export default DevPreview;