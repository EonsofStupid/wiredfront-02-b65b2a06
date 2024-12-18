import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";

interface AIAudioControlsProps {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isRecording?: boolean;
}

export const AIAudioControls = ({
  onStartRecording,
  onStopRecording,
  isRecording = false
}: AIAudioControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={isRecording ? onStopRecording : onStartRecording}
      >
        <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500' : ''}`} />
      </Button>
      <Button variant="ghost" size="icon">
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};