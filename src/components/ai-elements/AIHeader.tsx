import { Minimize2, X, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIHeaderProps {
  isMinimized: boolean;
  isOffline?: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export const AIHeader = ({ isMinimized, isOffline, onMinimize, onClose }: AIHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-dark-lighter/50 border-b border-white/10">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">AI Assistant</h3>
        {isOffline ? (
          <WifiOff className="w-4 h-4 text-destructive" />
        ) : (
          <Wifi className="w-4 h-4 text-green-500" />
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onMinimize}>
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};