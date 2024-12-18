import { Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreviewStore } from "@/stores/preview";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export const LivePreview = () => {
  const { isPreviewOpen, previewUrl, togglePreview, setPreviewUrl } = usePreviewStore();

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
                <Button variant="ghost" size="icon" onClick={togglePreview}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={previewUrl}
                className="h-full w-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};