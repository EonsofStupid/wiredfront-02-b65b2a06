import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { cn } from "@/lib/utils";

interface AIResponseProps {
  response: string;
  className?: string;
}

export const AIResponse = ({ response, className }: AIResponseProps) => {
  const { speak, isLoading, isSpeaking } = useTextToSpeech();

  if (!response) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="prose prose-invert flex-1">
          <p>{response}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => speak(response)}
          disabled={isLoading}
          className="flex-shrink-0"
        >
          {isSpeaking ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};