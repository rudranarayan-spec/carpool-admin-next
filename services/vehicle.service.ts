import { apiClient } from "@/lib/api";
import {
  GetVehiclesParams,
  VehicleListResponse,
  VehicleDetailResponse,
  UpdateVehicleStatusPayload,
  UpdateVehicleStatusResponse,
  UserVehiclesResponse,
} from "@/types/vehicle.types";

export const vehicleService = {
  getAllVehicles: async (params?: GetVehiclesParams): Promise<VehicleListResponse> => {
    const response = await apiClient.get<VehicleListResponse>("/admin/vehicles", { params });
    return response.data;
  },


  getVehicleById: async (id: number | string): Promise<VehicleDetailResponse> => {
    const response = await apiClient.get<VehicleDetailResponse>(`/admin/vehicles/${id}`);
    return response.data;
  },

  getVehiclesByUserId: async (userId: number | string): Promise<UserVehiclesResponse> => {
    const response = await apiClient.get<UserVehiclesResponse>(`/admin/vehicles/user/${userId}`);
    return response.data;
  },


  updateVehicleStatus: async (
    id: number | string,
    payload: UpdateVehicleStatusPayload
  ): Promise<UpdateVehicleStatusResponse> => {
    const response = await apiClient.patch<UpdateVehicleStatusResponse>(
      `/admin/vehicles/${id}`,
      payload
    );
    return response.data;
  },
};