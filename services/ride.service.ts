import { apiClient } from "@/lib/api";
import axios from "axios";
import {
  AdminRideDetailsData,
  CreateRidePayload,
  FetchAdminRideDetailsResponse,
  FetchPassengerRidesResponse,
  FetchRidesResponse,
  FetchSingleRideResponse,
  MutationRideResponse,
  PassengerRideItem,
  RideDetails,
  RideListItem,
  UpdateRidePayload,
} from "../types/rides.types";
import { DriverRideItem, FetchDriverRidesResponse } from "@/types/driver.types";

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
      const response = await apiClient.patch<MutationRideResponse>(`/rides/${id}`, payload);
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

  // Rides published by drived
  getRidesByDriverId: async (driverId: number | string): Promise<DriverRideItem[]> => {
    try {
      const response = await apiClient.get<FetchDriverRidesResponse>(
        `/rides/driver/${driverId}`
      );

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error("Failed to fetch driver rides");
    } catch (error: unknown) {
      console.error(`Error fetching rides for driver #${driverId}:`, parseApiError(error));
      throw error;
    }
  },

  // Rides booked by passenger 
  getRidesByPassengerId: async (passengerId: number | string): Promise<PassengerRideItem[]> => {
    try {
      const response = await apiClient.get<FetchPassengerRidesResponse>(
        `/rides/passenger/${passengerId}`
      );

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error("Failed to fetch passenger rides");
    } catch (error: unknown) {
      console.error(`Error fetching rides for passenger #${passengerId}:`, parseApiError(error));
      throw error;
    }
  },

  getAdminRideDetails: async (rideId: number | string): Promise<AdminRideDetailsData> => {
    try {
      const response = await apiClient.get<FetchAdminRideDetailsResponse>(
        `/rides/details/${rideId}`
      );

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error(response.data.message || "Failed to fetch admin ride details");
    } catch (error: unknown) {
      console.error(`Error fetching admin ride details for #${rideId}:`, parseApiError(error));
      throw error;
    }
  },
};

export default RideService;