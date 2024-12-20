import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import type { CommandResult } from "@/types/ai";

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
): Promise<CommandResult> => {
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

export const handleDevEnvironment = async (
  input: string,
  userId?: string
): Promise<CommandResult> => {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to manage development environments.",
    };
  }

  try {
    // First, check if we need to evaluate or setup the environment
    const isCheckOnly = input.includes("check");
    
    // Get current environment status
    const envStatus = await checkDevEnvironment(userId);
    
    if (isCheckOnly) {
      return {
        success: true,
        message: generateEnvironmentStatusMessage(envStatus),
      };
    }

    // If environment is incomplete or setup is explicitly requested, proceed with setup
    if (!envStatus.isComplete) {
      return setupDevEnvironment(userId, envStatus);
    }

    return {
      success: true,
      message: "Your development environment is already set up and ready to go!",
    };
  } catch (error) {
    console.error('Error managing dev environment:', error);
    return {
      success: false,
      message: "Failed to manage the development environment. Please try again.",
    };
  }
};

const generateEnvironmentStatusMessage = (status: EnvironmentStatus): string => {
  const messages = [];
  messages.push("Here's your current development environment status:");
  
  if (status.typescript) messages.push("✅ TypeScript is configured");
  else messages.push("❌ TypeScript needs to be configured");
  
  if (status.vite) messages.push("✅ Vite is set up");
  else messages.push("❌ Vite needs to be installed");
  
  if (status.tailwind) messages.push("✅ Tailwind CSS is installed");
  else messages.push("❌ Tailwind CSS needs to be configured");
  
  if (status.shadcn) messages.push("✅ shadcn/ui is available");
  else messages.push("❌ shadcn/ui needs to be installed");
  
  if (status.livePreview) messages.push("✅ Live preview is working");
  else messages.push("❌ Live preview needs to be configured");
  
  return messages.join("\n");
};