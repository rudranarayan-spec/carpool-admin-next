import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { DriverStatus } from "@/types/driver.types";

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at: string;
  total_vehicles: number;
  total_rides: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DriversApiResponse {
  success: boolean;
  data: Driver[];
  pagination: Pagination;
}

interface FetchDriversParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

// Fetch Drivers List using Axios instance
export const fetchDrivers = async ({
  page = 1,
  limit = 10,
  status,
  search,
}: FetchDriversParams): Promise<DriversApiResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (status && status !== "all") params.status = status;
  if (search) params.search = search;

  // Endpoint is relative to baseURL: https://carpool-node-backend-app.onrender.com/api/v1/admin
  const response = await apiClient.get<DriversApiResponse>("/drivers", {
    params,
  });
  return response.data;
};

// React Query Hook for Drivers
export function useDrivers(params: FetchDriversParams) {
  return useQuery({
    queryKey: ["drivers", params],
    queryFn: () => fetchDrivers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// React Query Hook for Driver Status Update (Approve/Reject/Suspend)
export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      driverId,
      status,
      reason,
    }: {
      driverId: number;
      status: DriverStatus;
      reason?: string;
    }) => {
      // Endpoint is relative to baseURL: https://carpool-node-backend-app.onrender.com/api/v1/admin
      const response = await apiClient.patch(`/drivers/${driverId}`, {
        status,
        reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
}
