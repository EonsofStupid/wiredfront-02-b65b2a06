import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { AIResponse } from './AIResponse';
import { AIInputForm } from './AIInputForm';
import { WifiOff } from 'lucide-react';

interface AIChatTabProps {
  messages: any[];
  input: string;
  isProcessing: boolean;
  isOnline: boolean;
  typingUsers: string[];
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AIChatTab = ({
  messages,
  input,
  isProcessing,
  isOnline,
  typingUsers,
  onInputChange,
  onSubmit
}: AIChatTabProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div className="flex-1 flex flex-col">
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          {typingUsers.length} user(s) typing...
        </div>
      )}

      <div 
        ref={parentRef}
        className="flex-1 overflow-auto flex flex-col-reverse"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="p-4"
            >
              <AIResponse response={messages[virtualRow.index].content} />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <AIInputForm 
          input={input}
          isProcessing={isProcessing}
          isOffline={!isOnline}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};