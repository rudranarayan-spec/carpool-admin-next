import { apiClient } from "@/lib/api";
import { ApiResponse, Conversation, ConversationDetailResponse, CreateConversationPayload } from "@/types/conversation.types";

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
};