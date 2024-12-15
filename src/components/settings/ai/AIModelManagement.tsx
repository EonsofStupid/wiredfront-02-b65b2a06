import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Cloud, HardDrive, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function AIModelManagement() {
  const { toast } = useToast();

  const { data: modelConfigs, isLoading } = useQuery({
    queryKey: ['aiModelConfigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_model_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleModelDownload = async (modelName: string) => {
    toast({
      title: "Starting Download",
      description: `Downloading ${modelName}. This may take a while...`,
    });
    // Implementation for model download will be added
  };

  const handleModelTrain = async (modelId: string) => {
    toast({
      title: "Starting Training",
      description: "Initiating model training process...",
    });
    // Implementation for model training will be added
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-neon-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gradient-text">AI Model Management</h2>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
          className="hover-glow"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        <Alert>
          <Bot className="h-4 w-4" />
          <AlertTitle>Hybrid AI System</AlertTitle>
          <AlertDescription>
            This system combines local Hugging Face models with cloud-based solutions for optimal performance.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {modelConfigs?.map((config) => (
            <div key={config.id} className="glass-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {config.model_type === 'local' ? (
                    <HardDrive className="w-5 h-5 text-neon-blue" />
                  ) : (
                    <Cloud className="w-5 h-5 text-neon-pink" />
                  )}
                  <h3 className="font-semibold">{config.model_name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  config.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {config.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {config.training_status !== 'not_started' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Training Progress</span>
                    <span>{config.training_status === 'completed' ? '100%' : '75%'}</span>
                  </div>
                  <Progress 
                    value={config.training_status === 'completed' ? 100 : 75} 
                    className="h-2"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {config.model_type === 'local' && !config.local_model_path && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleModelDownload(config.model_name)}
                    className="hover-glow"
                  >
                    <HardDrive className="w-4 h-4 mr-2" />
                    Download Model
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleModelTrain(config.id)}
                  className="hover-glow"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Train Model
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}