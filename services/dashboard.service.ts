import { apiClient } from "@/lib/api";
import { DashboardBootstrapResponse } from "@/types/dashboard.types";

export const dashboardService = {

  getDashboardBootstrap: async (): Promise<DashboardBootstrapResponse> => {
    const response = await apiClient.get<DashboardBootstrapResponse>(
      "/dashboard/bootstrap"
    );
    return response.data;
  },
};