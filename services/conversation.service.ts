import { apiClient } from "@/lib/api";
import {
  ApiResponse,
  Conversation,
  ConversationDetailResponse,
  CreateConversationPayload,
  ClearMessagesResponse,
  DeleteConversationResponse,
  DeleteMessageResponse,
} from "@/types/conversation.types";

const BASE_URL = '/admin/conversations';

export const conversationService = {
  getAllConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    const response = await apiClient.get<ApiResponse<Conversation[]>>(BASE_URL);
    return response.data;
  },

  getConversationMessages: async (conversationId: number): Promise<ApiResponse<ConversationDetailResponse>> => {
    const response = await apiClient.get<ApiResponse<ConversationDetailResponse>>(`${BASE_URL}/${conversationId}/messages`);
    return response.data;
  },

  createConversation: async (payload: CreateConversationPayload): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.post<ApiResponse<Conversation>>(BASE_URL, payload);
    return response.data;
  },

  clearConversationMessages: async (conversationId: number): Promise<ClearMessagesResponse> => {
    const response = await apiClient.delete<ClearMessagesResponse>(`${BASE_URL}/${conversationId}/messages`);
    return response.data;
  },

  deleteConversation: async (conversationId: number): Promise<DeleteConversationResponse> => {
    const response = await apiClient.delete<DeleteConversationResponse>(`${BASE_URL}/${conversationId}`);
    return response.data;
  },

  deleteMessage: async (messageId: number): Promise<DeleteMessageResponse> => {
    const response = await apiClient.delete<DeleteMessageResponse>(`${BASE_URL}/messages/${messageId}`);
    return response.data;
  },
};