import {apiClient} from "@/lib/api"; 
import {
  AnalyticsQueryParams,
  PlatformPerformanceData,
  AnalyticsApiResponse,
} from "@/types/analytics.types";

export const analyticsService = {
  /**
   * Fetches Platform Performance analytics data
   * @param params Query filters like timeframe ('7D') and comparison ('vs_previous')
   */
  getPlatformPerformance: async (
    params?: AnalyticsQueryParams
  ): Promise<AnalyticsApiResponse<PlatformPerformanceData>> => {
    const response = await apiClient.get<
      AnalyticsApiResponse<PlatformPerformanceData>
    >("/dashboard/analytics", {
      params,
    });

    return response.data;
  },
};