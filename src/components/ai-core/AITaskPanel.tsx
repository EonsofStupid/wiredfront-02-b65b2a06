import { motion } from "framer-motion";
import { X, Search, FileText, Settings, Terminal, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AITaskPanelProps {
  onClose: () => void;
}

export const AITaskPanel = ({ onClose }: AITaskPanelProps) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      // Here we'll integrate with the AI service to process the input
      // and generate/update code based on the user's request
      
      toast({
        title: "Processing request",
        description: "Generating code preview...",
      });

      // Simulated delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Preview ready",
        description: "Check the preview panel to see the changes",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">AI Assistant</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 pr-20"
            placeholder="What would you like me to help you with?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Terminal className="w-4 h-4" />
              </motion.div>
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskCard
          icon={FileText}
          title="File Management"
          description="Organize, edit, and manage your files"
        />
        <TaskCard
          icon={Terminal}
          title="Code Generation"
          description="Generate and preview code changes"
        />
        <TaskCard
          icon={Settings}
          title="Preview Settings"
          description="Configure preview behavior"
        />
      </div>
    </motion.div>
  );
};

interface TaskCardProps {
  icon: any;
  title: string;
  description: string;
}

const TaskCard = ({ icon: Icon, title, description }: TaskCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-card p-4 cursor-pointer"
    >
      <Icon className="h-6 w-6 mb-2 text-neon-blue" />
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  );
};