import { apiClient } from "@/lib/api";
import axios from "axios";
import {
  CreateRidePayload,
  FetchRidesResponse,
  FetchSingleRideResponse,
  MutationRideResponse,
  RideDetails,
  RideListItem,
  UpdateRidePayload,
} from "../types/rides.types";

const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const RideService = {
  getAllRides: async (): Promise<RideListItem[]> => {
    try {
      const response = await apiClient.get<FetchRidesResponse>("/rides");

      if (response.data.status === "success") {
        return response.data.data;
      }

      throw new Error("Failed to fetch rides: API returned unsuccessful status");
    } catch (error: unknown) {
      console.error("Error fetching rides:", parseApiError(error));
      throw error;
    }
  },

  getRideById: async (id: number | string): Promise<RideDetails> => {
    try {
      const response = await apiClient.get<FetchSingleRideResponse>(`/rides/${id}`);

      if (response.data.status === "success") {
        return response.data.data;
      }

      throw new Error("Failed to fetch ride details");
    } catch (error: unknown) {
      console.error(`Error fetching ride #${id}:`, parseApiError(error));
      throw error;
    }
  },

  createRide: async (payload: CreateRidePayload): Promise<MutationRideResponse> => {
    try {
      const response = await apiClient.post<MutationRideResponse>("/rides", payload);
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating ride:", parseApiError(error));
      throw error;
    }
  },

  updateRide: async (id: number | string, payload: UpdateRidePayload): Promise<MutationRideResponse> => {
    try {
      const response = await apiClient.put<MutationRideResponse>(`/rides/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      console.error(`Error updating ride #${id}:`, parseApiError(error));
      throw error;
    }
  },

  deleteRide: async (id: number | string): Promise<MutationRideResponse> => {
    try {
      const response = await apiClient.delete<MutationRideResponse>(`/rides/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error(`Error deleting ride #${id}:`, parseApiError(error));
      throw error;
    }
  },
};

export default RideService;