import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAIPersonalityStore } from '@/stores/aiPersonality';
import { Loader2 } from 'lucide-react';

export const AIPersonalityManager = () => {
  const { toast } = useToast();
  const { 
    currentPersonality,
    traits,
    isLoading,
    error,
    fetchPersonality,
    fetchTraits
  } = useAIPersonalityStore();

  useEffect(() => {
    const loadDefaultPersonality = async () => {
      try {
        // For now, we'll fetch the first active personality
        const { data, error } = await supabase
          .from('ai_personalities')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single();

        if (error) throw error;
        if (data) {
          await fetchPersonality(data.id);
          await fetchTraits(data.id);
        }
      } catch (error: any) {
        toast({
          title: "Error loading AI personality",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    loadDefaultPersonality();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 text-red-900">
        <p>Error: {error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {currentPersonality?.name || 'No personality selected'}
        </h3>
        {currentPersonality?.description && (
          <p className="text-sm text-gray-500">{currentPersonality.description}</p>
        )}
      </div>

      {traits.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Personality Traits</h4>
          <div className="grid gap-2">
            {traits.map((trait) => (
              <div 
                key={trait.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
              >
                <span className="font-medium">{trait.trait_key}</span>
                <span className="text-sm text-gray-600">
                  {JSON.stringify(trait.trait_value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};