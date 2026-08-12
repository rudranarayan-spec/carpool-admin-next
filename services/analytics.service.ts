import { apiClient } from "@/lib/api";
import {
  AnalyticsQueryParams,
  PlatformPerformanceData,
  AnalyticsApiResponse,
  GrowthAndCorridorsResponse,
} from "@/types/analytics.types";

export const analyticsService = {
  getPlatformPerformance: async (
    params?: AnalyticsQueryParams,
  ): Promise<AnalyticsApiResponse<PlatformPerformanceData>> => {
    const response = await apiClient.get<
      AnalyticsApiResponse<PlatformPerformanceData>
    >("/admin/dashboard/analytics", {
      params,
    });

    return response.data;
  },

  getDashboardGrowth: async (): Promise<GrowthAndCorridorsResponse> => {
    const response = await apiClient.get<GrowthAndCorridorsResponse>(
      "/admin/dashboard/growth",
    );
    return response.data;
  },
};
