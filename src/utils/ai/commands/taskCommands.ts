import { supabase } from "@/integrations/supabase/client";
import type { CommandResult } from "@/types/ai";
import { v4 as uuidv4 } from 'uuid';

export const handleTaskCreation = async (
  input: string,
  userId?: string
): Promise<CommandResult> => {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to create tasks.",
    };
  }

  const taskDescription = input.replace(/create task|new task/gi, '').trim();
  
  const { data, error } = await supabase
    .from('ai_tasks')
    .insert({
      task_id: uuidv4(),
      prompt: taskDescription,
      type: 'automation',
      provider: 'gemini',
      status: 'pending',
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: "Failed to create the task. Please try again.",
    };
  }

  return {
    success: true,
    message: `Task created: ${taskDescription}`,
    data: data,
  };
};