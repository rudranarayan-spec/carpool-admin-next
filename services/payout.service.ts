import { apiClient } from "@/lib/api";
import {
  GetPayoutsQueryParams,
  GetPayoutsResponse,
  GetPayoutDetailResponse,
  ProcessPayoutResponse,
} from "@/types/payouts.types";

export class PayoutService {
  static async getPayouts(
    params?: GetPayoutsQueryParams
  ): Promise<GetPayoutsResponse> {
    try {
      const response = await apiClient.get<GetPayoutsResponse>(
        "/admin/payouts",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payouts list:", error);
      throw error;
    }
  }

  static async getPayoutById(
    id: number | string
  ): Promise<GetPayoutDetailResponse> {
    try {
      const response = await apiClient.get<GetPayoutDetailResponse>(
        `/admin/payouts/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching payout #${id} details:`, error);
      throw error;
    }
  }


  static async processPayout(
    id: number | string
  ): Promise<ProcessPayoutResponse> {
    try {
      const response = await apiClient.post<ProcessPayoutResponse>(
        `/admin/payouts/${id}/process`
      );
      return response.data;
    } catch (error) {
      console.error(`Error processing payout #${id}:`, error);
      throw error;
    }
  }
}