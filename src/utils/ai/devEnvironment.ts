import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface EnvironmentStatus {
  isComplete: boolean;
  typescript: boolean;
  vite: boolean;
  tailwind: boolean;
  shadcn: boolean;
  livePreview: boolean;
}

export const checkDevEnvironment = async (userId: string): Promise<EnvironmentStatus> => {
  try {
    const { data: envData, error } = await supabase
      .from('testing_environments')
      .select('*')
      .eq('user_id', userId)
      .eq('framework', 'react')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!envData) {
      return {
        isComplete: false,
        typescript: false,
        vite: false,
        tailwind: false,
        shadcn: false,
        livePreview: false,
      };
    }

    const config = envData.docker_config as any;
    
    return {
      isComplete: 
        config.typescript && 
        config.vite && 
        config.tailwind && 
        config.shadcn && 
        config.livePreview,
      typescript: !!config.typescript,
      vite: !!config.vite,
      tailwind: !!config.tailwind,
      shadcn: !!config.shadcn,
      livePreview: !!config.livePreview,
    };
  } catch (error) {
    console.error('Error checking dev environment:', error);
    throw error;
  }
};

export const setupDevEnvironment = async (
  userId: string,
  currentStatus: EnvironmentStatus
): Promise<{ success: boolean; message: string }> => {
  try {
    const dockerConfig = {
      typescript: true,
      vite: true,
      tailwind: true,
      shadcn: true,
      livePreview: true,
      port: 3000,
      nodeVersion: '20.x',
    };

    // Create or update the testing environment
    const { error } = await supabase
      .from('testing_environments')
      .upsert({
        user_id: userId,
        environment_name: 'React Development',
        framework: 'react',
        docker_config: dockerConfig,
        is_active: true,
      });

    if (error) throw error;

    // Create a task to track the setup progress
    const { error: taskError } = await supabase
      .from('ai_tasks')
      .insert({
        task_id: uuidv4(),
        prompt: 'Setup development environment',
        type: 'automation',
        provider: 'gemini',
        status: 'processing',
        priority: 1,
        metadata: JSON.stringify({
          environment: 'react',
          components: ['typescript', 'vite', 'tailwind', 'shadcn'],
          previousStatus: {
            typescript: currentStatus.typescript,
            vite: currentStatus.vite,
            tailwind: currentStatus.tailwind,
            shadcn: currentStatus.shadcn,
            livePreview: currentStatus.livePreview,
          }
        }),
        user_id: userId,
      });

    if (taskError) throw taskError;

    return {
      success: true,
      message: "I'm setting up your development environment with TypeScript, Vite, Tailwind CSS, and shadcn/ui. I'll notify you once it's ready.",
    };
  } catch (error) {
    console.error('Error setting up dev environment:', error);
    throw error;
  }
};