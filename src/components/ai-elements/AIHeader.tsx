import { X, Minimize2, WifiOff, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIHeaderProps {
  isMinimized: boolean;
  isOffline: boolean;
  isListening: boolean;
  onMinimize: () => void;
  onClose: () => void;
  onVoiceToggle: () => void;
}

export const AIHeader = ({
  isMinimized,
  isOffline,
  isListening,
  onMinimize,
  onClose,
  onVoiceToggle,
}: AIHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">AI Assistant</h3>
        {isOffline && (
          <div className="flex items-center gap-1 text-xs text-yellow-500">
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onVoiceToggle}
        >
          {isListening ? (
            <MicOff className="h-4 w-4 text-red-500" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMinimize}
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};