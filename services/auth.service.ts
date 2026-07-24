// services/auth.service.ts
import { apiClient } from "@/lib/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_picture?: string | null;
  [key: string]: unknown;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  status: "success" | "error" | string;
  message: string;
  token: string;
  user: AdminUser;
  [key: string]: unknown;
}

export const authService = {
  adminLogin: async (payload: AdminLoginPayload): Promise<AdminLoginResponse> => {
    const response = await apiClient.post<AdminLoginResponse>("/admin/login", payload);
    return response.data;
  },
};