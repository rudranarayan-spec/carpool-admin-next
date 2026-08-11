import { apiClient } from "@/lib/api";
import {
  SiteSettingsResponse,
  CommissionResponse,
  UpdateCommissionPayload,
  UpdateSiteSettingsPayload,
} from "@/types/siteSettings.types";

export const siteSettingsService = {
  getSettings: async (): Promise<SiteSettingsResponse> => {
    const response = await apiClient.get<SiteSettingsResponse>("/admin/platform");
    return response.data;
  },

  updateSettings: async (
    payload: UpdateSiteSettingsPayload,
  ): Promise<SiteSettingsResponse> => {
    const isFormData = payload instanceof FormData;
    const response = await apiClient.put<SiteSettingsResponse>(
      "/admin/platform",
      payload,
      {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      },
    );
    return response.data;
  },

  getCommission: async (): Promise<CommissionResponse> => {
    const response = await apiClient.get<CommissionResponse>(
      "/admin/platform/commission",
    );
    return response.data;
  },

  updateCommission: async (
    payload: UpdateCommissionPayload,
  ): Promise<CommissionResponse> => {
    const response = await apiClient.put<CommissionResponse>(
      "/admin/platform/commission",
      payload,
    );
    return response.data;
  },
};

export default siteSettingsService;
