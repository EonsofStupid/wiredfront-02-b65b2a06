import { supabase } from "@/integrations/supabase/client";
import type { CommandResult } from "@/types/ai";

export const handleFileOperation = async (
  input: string,
  userId?: string
): Promise<CommandResult> => {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to perform file operations.",
    };
  }

  const isCreate = input.includes('create file');
  const operation = isCreate ? 'create' : 'edit';
  const filePath = input.replace(/(create|edit) file/gi, '').trim();

  const { data, error } = await supabase
    .from('file_operations')
    .insert({
      file_path: filePath,
      operation_type: operation,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: "Failed to process file operation. Please try again.",
    };
  }

  return {
    success: true,
    message: `File operation started: ${operation} ${filePath}`,
    data: data,
  };
};