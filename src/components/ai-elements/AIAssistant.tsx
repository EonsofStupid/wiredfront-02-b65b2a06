import React, { useEffect, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, MessageSquare, Settings, Cpu } from "lucide-react";
import { useAIStore } from '@/stores/ai';
import { useMessageQueue } from '@/stores/messageQueue';
import { AITaskPanel } from '../ai-core/AITaskPanel';
import { AudioControls } from './audio/AudioControls';
import { AICore } from '../ai-core/AICore';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { AIOptionsTab } from './AIOptionsTab';

export const AIAssistant = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isVisible = useAIStore((state) => state.isVisible);
  const { messages, initializeWorker } = useMessageQueue();
  const { toast } = useToast();
  const [size, setSize] = useState({ width: 400, height: 600 });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'ai-assistant',
  });

  useEffect(() => {
    initializeWorker();

    const channel = supabase.channel('ai-assistant')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state:', state);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initializeWorker]);

  if (!isVisible) return null;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "fixed bottom-20 right-4 bg-background/95 backdrop-blur-lg rounded-lg",
        "border border-border shadow-lg flex flex-col z-50 overflow-hidden",
        "glass-card hover:shadow-xl hover:border-primary/20",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="h-8 w-full bg-muted/50 cursor-move flex items-center px-4"
      >
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-neon-pink" />
          <div className="w-3 h-3 rounded-full bg-neon-blue" />
          <div className="w-3 h-3 rounded-full bg-neon-violet" />
        </div>
      </div>

      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={100}>
          <Tabs defaultValue="chat" className="w-[400px] h-[600px]">
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1 gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex-1 gap-2">
                <Volume2 className="w-4 h-4" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="core" className="flex-1 gap-2">
                <Cpu className="w-4 h-4" />
                Core
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-0 h-[calc(100%-3rem)]">
              <AITaskPanel 
                onClose={() => {}}
                typingUsers={[]}
                onTypingChange={() => {}}
              />
            </TabsContent>

            <TabsContent value="audio" className="mt-0 p-4">
              <div className="glass-card p-4 space-y-4">
                <h3 className="text-lg font-semibold">Voice Controls</h3>
                <AudioControls
                  onTranscript={(text) => {
                    toast({
                      title: "Transcript received",
                      description: text,
                    });
                  }}
                  currentMessage=""
                />
              </div>
            </TabsContent>

            <TabsContent value="core" className="mt-0">
              <AICore />
            </TabsContent>

            <TabsContent value="settings" className="mt-0 p-4">
              <div className="glass-card p-4 space-y-4">
                <h3 className="text-lg font-semibold">AI Settings</h3>
                <AIOptionsTab />
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};