// services/userService.ts
import { apiClient } from "@/lib/api";

export interface UserStats {
  totalUsers: number;
  verifiedAccounts: number;
  pendingApproval: number;
  suspendedUsers: number;
}

export interface UserListItem {
  id: number;
  custom_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  verification_status: string;
  kyc_status: string;
  profile_picture: string | null;
  location: string;
  created_at: string;
}

export interface UserDetails extends UserListItem {
  updated_at: string | null;
  user_details: {
    city: string;
    state: string;
    country: string;
    address: string;
    postal_code: string;
    driver_license: string | null;
    is_dl_verified: string;
    adhhar_card: string | null;
    is_adhhar_verified: string;
    pan_card: string | null;
    is_pan_verified: string;
    bank_account: string | null;
    bank_account_holder: string;
    bank_account_number: string;
    bank_name: string;
    bank_account_ifsc: string;
    is_account_verified: string;
    details_status: string;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UsersApiResponse {
  status: string;
  data: {
    stats: UserStats;
    users: UserListItem[];
    pagination: {
      page: number;
      limit: number;
    };
  };
}

export interface SingleUserApiResponse {
  status: string;
  data: {
    user: UserDetails;
  };
}

export const userService = {
  /**
   * Fetches users list and statistics
   */
  async getUsers(params: GetUsersParams = {}): Promise<UsersApiResponse["data"]> {
    const queryParams: Record<string, string | number> = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (params.search?.trim()) {
      queryParams.search = params.search.trim();
    }

    if (params.role && params.role !== "All") {
      queryParams.role = params.role;
    }

    if (params.status && params.status !== "All") {
      queryParams.status = params.status;
    }

    const response = await apiClient.get<UsersApiResponse>("/users", {
      params: queryParams,
    });

    return response.data.data;
  },

  /**
   * Fetches single user detail
   */
  async getUserDetails(userId: string | number): Promise<UserDetails> {
    const response = await apiClient.get<SingleUserApiResponse>(`/users/${userId}`);
    return response.data.data.user;
  },
};

export default userService;