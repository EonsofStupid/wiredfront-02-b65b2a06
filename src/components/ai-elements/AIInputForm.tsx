import { Bot, Code, FileText, Loader, WifiOff } from "lucide-react";
import type { AIMode } from "@/types/ai";

interface AIInputFormProps {
  input: string;
  mode: AIMode;
  isProcessing: boolean;
  isOffline: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AIInputForm = ({
  input,
  mode,
  isProcessing,
  isOffline,
  onInputChange,
  onSubmit,
}: AIInputFormProps) => {
  const getModeIcon = (currentMode: AIMode) => {
    switch (currentMode) {
      case "chat":
        return <Bot className="w-4 h-4" />;
      case "code":
        return <Code className="w-4 h-4" />;
      case "file":
        return <FileText className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <textarea
        className="ai-assistant__textarea"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={
          isOffline
            ? "Working in offline mode. Limited functionality available..."
            : mode === "chat"
            ? "Ask me anything..."
            : mode === "code"
            ? "Describe the code changes you need..."
            : "Describe what you want to do with your files..."
        }
      />
      <button 
        type="submit" 
        className={`ai-assistant__button ${isOffline ? 'opacity-70' : ''}`}
        disabled={isProcessing || (isOffline && mode !== "chat")}
      >
        {isProcessing ? (
          <Loader className="w-4 h-4 animate-spin mr-2 inline" />
        ) : isOffline ? (
          <>
            <WifiOff className="w-4 h-4 mr-2" />
            <span>Offline Mode</span>
          </>
        ) : (
          <>
            {getModeIcon(mode)}
            <span className="ml-2">
              {mode === "chat"
                ? "Ask AI"
                : mode === "code"
                ? "Generate Code"
                : "Process Files"}
            </span>
          </>
        )}
      </button>
    </form>
  );
};