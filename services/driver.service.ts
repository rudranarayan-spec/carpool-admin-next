import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import {
  ApiResponse,
  Driver,
  DriverDetailsApiResponse,
  DriverStatus,
  GetPendingDriversParams,
  PendingDriversResponse,
  UpdateDriverStatusRequest,
  VerifyDocumentRequest,
} from "@/types/driver.types";


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
    staleTime: 1000 * 60 * 2,
  });
}

export const DriverService = {
  async getDriverById(driverId: number | string): Promise<DriverDetailsApiResponse> {
    const response = await apiClient.get<DriverDetailsApiResponse>(
      `/admin/drivers/${driverId}`
    );
    return response.data;
  },
};

export function useUpdateDriverActivityStatus() {
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

export const DriverApproval = {
  getPendingDrivers: async (
    params?: GetPendingDriversParams,
  ): Promise<PendingDriversResponse> => {
    const response = await apiClient.get<PendingDriversResponse>(
      "/drivers/pending",
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search || "",
        },
      },
    );

    return response.data;
  },
  async verifyDocument({
    driverId,
    docType,
    status,
  }: VerifyDocumentRequest): Promise<ApiResponse> {
    const response = await apiClient.patch<ApiResponse>(
      `/drivers/${driverId}/verify-document`,
      {
        docType,
        status,
      },
    );
    return response.data;
  },

  async updateDriverStatus({
    driverId,
    status,
  }: UpdateDriverStatusRequest): Promise<ApiResponse> {
    const response = await apiClient.patch<ApiResponse>(
      `/drivers/${driverId}/status`,
      {
        status,
      },
    );
    return response.data;
  },
};
