export interface TypingStatus {
  user_id: string;
  chat_id: string;
  is_typing: boolean;
  last_updated: string;
}

export interface RealtimePayload<T> {
  commit_timestamp: string;
  errors: null | any[];
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T | null;
  schema: string;
  table: string;
}