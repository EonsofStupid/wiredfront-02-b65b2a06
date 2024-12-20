import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import type { AITask } from "@/types/database/ai";

export const createTask = async (config: Partial<AITask>): Promise<AITask> => {
  if (!config.prompt || !config.type || !config.provider) {
    throw new Error('Missing required task fields');
  }

  const taskData = {
    task_id: uuidv4(),
    type: config.type,
    prompt: config.prompt,
    provider: config.provider,
    status: 'pending',
    priority: config.priority || 5,
    metadata: config.metadata || {},
    user_id: (await supabase.auth.getUser()).data.user?.id
  };

  const { data, error } = await supabase
    .from('ai_tasks')
    .insert(taskData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getNextTask = async (): Promise<AITask | null> => {
  const { data, error } = await supabase
    .from('ai_tasks')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
};

export const updateTaskStatus = async (
  taskId: string,
  update: Partial<AITask>
): Promise<AITask> => {
  const { data, error } = await supabase
    .from('ai_tasks')
    .update(update)
    .eq('task_id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTasksByStatus = async (status: string): Promise<AITask[]> => {
  const { data, error } = await supabase
    .from('ai_tasks')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getTaskById = async (taskId: string): Promise<AITask | null> => {
  const { data, error } = await supabase
    .from('ai_tasks')
    .select('*')
    .eq('task_id', taskId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
};