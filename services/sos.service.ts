import { apiClient } from "@/lib/api";
import {
  GetSosByIdResponse,
  GetSosParams,
  GetSosResponse,
  UpdateSosStatusPayload,
  UpdateSosStatusResponse,
} from "@/types/sos.types";

const SosService = {
  async getSosAlerts(params?: GetSosParams): Promise<GetSosResponse> {
    const response = await apiClient.get<GetSosResponse>("/admin/sos", {
      params,
    });
    return response.data;
  },

  /**
   * Fetch a single SOS alert by ID
   */
  async getSosById(id: number): Promise<GetSosByIdResponse> {
    const response = await apiClient.get<GetSosByIdResponse>(`/sos/${id}`);
    return response.data;
  },

  /**
   * Update the status and resolution notes of an SOS alert
   */
  async updateSosStatus(
    id: number,
    payload: UpdateSosStatusPayload,
  ): Promise<UpdateSosStatusResponse> {
    const response = await apiClient.patch<UpdateSosStatusResponse>(
      `/admin/sos/${id}/status`,
      payload,
    );
    return response.data;
  },
};

export default SosService;
