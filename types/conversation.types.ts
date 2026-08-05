export interface Conversation {
  id: number;
  booking_id: number;
  ride_id: number;
  driver_id: number;
  passenger_id: number;
  created_at: string;
  updated_at: string;
  driver_name: string;
  driver_email?: string;
  driver_phone: string;
  passenger_name: string;
  passenger_email?: string;
  passenger_phone: string;
  source_address?: string;
  destination_address?: string;
  last_message: string | null;
  last_message_at: string | null;
}

export interface ConversationMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  is_read: number;
  created_at: string;
  updated_at: string;
  sender_name: string;
  sender_role: string;
}

export interface ConversationDetailResponse {
  conversation: Omit<Conversation, 'driver_email' | 'passenger_email' | 'source_address' | 'destination_address' | 'last_message' | 'last_message_at'>;
  messages: ConversationMessage[];
}

export interface PaginationMeta {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
}

export interface CreateConversationPayload {
  booking_id: number;
  ride_id: number;
  driver_id: number;
  passenger_id: number;
}