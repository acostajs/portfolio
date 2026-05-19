export interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isInitial?: boolean;
  shouldAnimate?: boolean;
  module?: string;
  category?: string;
}

export interface ChatSyncResponse {
  messages: Message[];
  is_active: boolean;
}

export interface ChatResponse {
  reply: string;
  module?: string;
  category?: string;
  is_live: boolean;
}

export interface Suggestion {
  text: string;
  subtext?: string;
  value: string;
  isCommand: boolean;
}
