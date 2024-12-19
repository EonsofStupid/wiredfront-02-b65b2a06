import { useEffect, useRef, useState } from 'react';
import type { SpeechRecognition } from '@/types/speech';
import { useToast } from '@/components/ui/use-toast';

export const useSpeechRecognition = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          variant: "destructive",
          title: "Speech Recognition Error",
          description: "Failed to recognize speech. Please try again."
        });
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onTranscript, toast]);

  const toggleVoiceInput = () => {
    if (!recognition.current) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser"
      });
      return;
    }

    if (isListening) {
      recognition.current.stop();
    } else {
      try {
        recognition.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to start speech recognition"
        });
      }
    }
  };

  return { isListening, toggleVoiceInput };
};