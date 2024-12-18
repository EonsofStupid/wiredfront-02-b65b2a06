export interface TypingStatus {
  id: number;
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  last_updated: string;
}