import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface AICommandSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const AICommandSuggestions = ({ suggestions, onSelect }: AICommandSuggestionsProps) => {
  if (!suggestions?.length) return null;

  return (
    <ScrollArea className="h-32 rounded-md border p-4">
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};