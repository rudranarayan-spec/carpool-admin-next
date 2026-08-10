import { apiClient } from "@/lib/api";
import { BaseApiResponse, GetUsersParams, SingleUserApiResponse, UserDetails, UsersApiResponse, UserStatusUpdateData } from "@/types/userService";

export type UserStatusType = "active" | "inactive";



export const userService = {
  /**
   * Fetch paginated list of users
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

    const response = await apiClient.get<UsersApiResponse>("/admin/users", {
      params: queryParams,
    });

    return response.data.data;
  },

  /**
   * Fetch detailed user profile by ID
   */
  async getUserDetails(userId: string | number): Promise<UserDetails> {
    const response = await apiClient.get<SingleUserApiResponse>(`/admin/users/${userId}`);
    return response.data.data.user;
  },

  /**
   * Toggle or update user status between 'active' and 'inactive'
   * Route: PATCH /admin/users/:id
   */
  async updateUserStatus(
    userId: string | number,
    status: UserStatusType
  ): Promise<BaseApiResponse<UserStatusUpdateData>> {
    const response = await apiClient.patch<BaseApiResponse<UserStatusUpdateData>>(
      `/admin/users/${userId}`,
      { status }
    );
    return response.data;
  },

  /**
   * Block a user account (sets status to 'blocked')
   * Route: PATCH /admin/users/:id/block
   */
  async blockUser(userId: string | number): Promise<BaseApiResponse<UserStatusUpdateData>> {
    const response = await apiClient.patch<BaseApiResponse<UserStatusUpdateData>>(
      `/admin/users/${userId}/block`
    );
    return response.data;
  },
};

export default userService;