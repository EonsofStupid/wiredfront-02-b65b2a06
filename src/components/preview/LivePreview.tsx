import { useEffect, useState } from "react";
import { Monitor, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreviewStore } from "@/stores/preview";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export const LivePreview = () => {
  const { isPreviewOpen, togglePreview } = usePreviewStore();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState("http://localhost:8081");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize preview server
    const initPreview = async () => {
      try {
        const response = await fetch("/api/preview/init", {
          method: "POST"
        });
        
        if (!response.ok) throw new Error("Failed to initialize preview server");
        
        const { url } = await response.json();
        setPreviewUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Preview server error:", error);
        toast({
          title: "Preview Error",
          description: "Failed to start preview server. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (isPreviewOpen) {
      initPreview();
    }

    return () => {
      // Cleanup preview server
      if (isPreviewOpen) {
        fetch("/api/preview/cleanup", { method: "POST" }).catch(console.error);
      }
    };
  }, [isPreviewOpen, toast]);

  if (!isPreviewOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="container flex h-full items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="glass-card border border-border/50">
            <div className="flex items-center justify-between border-b border-border/50 p-4">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Live Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  className="w-[300px]"
                  placeholder="Enter preview URL..."
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
                    if (iframe) iframe.src = iframe.src;
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={togglePreview}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="aspect-video w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <iframe
                  id="preview-iframe"
                  src={previewUrl}
                  className="h-full w-full border-0"
                  title="Live Preview"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};