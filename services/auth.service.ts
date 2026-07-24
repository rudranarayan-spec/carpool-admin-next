// services/auth.service.ts
import { apiClient } from "@/lib/api";

export interface UserDetails {
  id: number;
  user_id: number;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  address?: string;
  driver_license?: string;
  is_dl_verified?: string;
  adhhar_card?: string;
  is_adhhar_verified?: string;
  pan_card?: string;
  is_pan_verified?: string;
  bank_account?: string;
  is_account_verified?: string;
  bank_account_holder?: string;
  bank_account_number?: string;
  bank_account_ifsc?: string;
  bank_name?: string;
  profile_picture?: string;
  is_verified?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown; // Handles unexpected future fields flexibly
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  user_details?: UserDetails;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: "success" | "error" | string;
  message: string;
  token: string;
  user: User;
  [key: string]: unknown;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/login", payload);
    return response.data;
  },
};