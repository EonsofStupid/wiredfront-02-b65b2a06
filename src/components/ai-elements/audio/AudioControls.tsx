import { useState, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/components/ui/use-toast';

interface AudioControlsProps {
  onTranscript: (text: string) => void;
  currentMessage?: string;
}

export const AudioControls = ({ onTranscript, currentMessage }: AudioControlsProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();
  const { speak, isLoading: isSpeaking } = useTextToSpeech();
  const { isListening, toggleVoiceInput } = useSpeechRecognition((text) => {
    onTranscript(text);
    toast({
      title: "Voice Input Received",
      description: text,
    });
  });

  const handleVoiceToggle = useCallback(() => {
    toggleVoiceInput();
    toast({
      title: isListening ? "Voice Input Stopped" : "Voice Input Started",
      description: isListening ? "No longer listening" : "Listening for voice input...",
    });
  }, [isListening, toggleVoiceInput, toast]);

  const handleSpeakToggle = useCallback(() => {
    if (currentMessage) {
      if (!isMuted) {
        speak(currentMessage);
      }
      setIsMuted(!isMuted);
    }
  }, [currentMessage, isMuted, speak]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={`transition-all duration-200 ${isListening ? 'text-red-500 animate-pulse' : ''}`}
        onClick={handleVoiceToggle}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`transition-all duration-200 ${isSpeaking ? 'text-green-500 animate-pulse' : ''}`}
        onClick={handleSpeakToggle}
        disabled={!currentMessage}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};