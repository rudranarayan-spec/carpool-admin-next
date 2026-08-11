/* eslint-disable @typescript-eslint/no-explicit-any */

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
  conversation: Omit<
    Conversation,
    | 'driver_email'
    | 'passenger_email'
    | 'source_address'
    | 'destination_address'
    | 'last_message'
    | 'last_message_at'
  >;
  messages: ConversationMessage[];
}

export interface PaginationMeta {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ApiResponse<T = any> {
  status?: string;
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface CreateConversationPayload {
  booking_id: number;
  ride_id: number;
  driver_id: number;
  passenger_id: number;
}

// Action Response Types for Delete & Clear operations
export interface ClearMessagesResponse {
  status?: string;
  success: boolean;
  message: string;
  deletedCount?: number;
}

export interface DeleteConversationResponse {
  status?: string;
  success: boolean;
  message: string;
  affectedRows?: number;
}

// Added type for deleting a single message
export interface DeleteMessageResponse {
  status?: string;
  success: boolean;
  message: string;
  data?: {
    messageId: number;
  };
}