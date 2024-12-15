import { Command } from "@/utils/ai/commandHandler";

interface AICommandSuggestionsProps {
  suggestions: Command[];
  onSelect: (command: Command) => void;
}

export const AICommandSuggestions = ({ suggestions, onSelect }: AICommandSuggestionsProps) => {
  if (!suggestions.length) return null;

  return (
    <div className="absolute bottom-full left-0 w-full mb-2 bg-background/95 backdrop-blur-sm rounded-md border border-border p-2 space-y-1">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => onSelect(suggestion)}
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded hover:bg-accent"
        >
          {suggestion.trigger[0]}: {suggestion.description}
        </div>
      ))}
    </div>
  );
};