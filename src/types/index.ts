export type TaskStatus = 'to_do' | 'done' | 'hold' | 'cancel';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: 'email' | 'google';
  is_active: boolean;
  deactivated_at: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  status: TaskStatus;
  reminder_date: string;
  next_remind_at: string | null;
  reminder_count: number;
  last_reminded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TelegramConnection {
  id: string;
  user_id: string;
  telegram_chat_id: string | null;
  connect_token: string | null;
  is_connected: boolean;
  connected_at: string | null;
  created_at: string;
}
