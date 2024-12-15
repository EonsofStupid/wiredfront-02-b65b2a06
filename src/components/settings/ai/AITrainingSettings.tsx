import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AITrainingSettings() {
  const { toast } = useToast();
  const [trainingData, setTrainingData] = useState("");
  const [category, setCategory] = useState("faq");

  const handleSubmitTraining = async () => {
    try {
      const { error } = await supabase
        .from('ai_training_data')
        .insert({
          category,
          content: trainingData,
        });

      if (error) throw error;

      toast({
        title: "Training data added",
        description: "Your AI assistant will learn from this new information."
      });
      setTrainingData("");
    } catch (error) {
      toast({
        title: "Error adding training data",
        description: "Failed to save training data.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">AI Training</h3>
        <p className="text-sm text-muted-foreground">
          Provide custom training data to improve your AI assistant
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Training Data</Label>
          <Textarea
            value={trainingData}
            onChange={(e) => setTrainingData(e.target.value)}
            placeholder="Enter FAQs, common phrases, or specific terminology..."
            className="min-h-[200px]"
          />
        </div>

        <Button onClick={handleSubmitTraining} className="w-full">
          Add Training Data
        </Button>
      </div>
    </Card>
  );
}