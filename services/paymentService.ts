import { apiClient } from "@/lib/api";
import {
  GetAdminPaymentByIdResponse,
  GetAdminPaymentsParams,
  GetAdminPaymentsResponse,
  GetPassengerTransactionsParams,
  GetPassengerTransactionsResponse,
  GetRefundRequestsParams,
  GetRefundRequestsResponse,
  ProcessRefundPayload,
  ProcessRefundResponse,
  UpdatePaymentStatusPayload,
  UpdatePaymentStatusResponse,
} from "@/types/payment";

export const paymentService = {
  // Fetch list of payments with pagination, status, search filters
  async getAdminPayments({
    page = 1,
    limit = 10,
    status,
    passengerId,
    search,
  }: GetAdminPaymentsParams = {}): Promise<GetAdminPaymentsResponse> {
    const response = await apiClient.get<GetAdminPaymentsResponse>(
      "/payments",
      {
        params: {
          page,
          limit,
          status,
          passengerId,
          search,
        },
      },
    );

    return response.data;
  },

  async getAdminPaymentById(
    paymentId: string | number,
  ): Promise<GetAdminPaymentByIdResponse> {
    const response = await apiClient.get<GetAdminPaymentByIdResponse>(
      `/payments/${paymentId}`,
    );

    return response.data;
  },

  async updatePaymentStatus(
    paymentId: string | number,
    payload: UpdatePaymentStatusPayload,
  ): Promise<UpdatePaymentStatusResponse> {
    const response = await apiClient.patch<UpdatePaymentStatusResponse>(
      `/payments/${paymentId}/`,
      payload,
    );
    return response.data;
  },

  // Initiate full or partial refund via Razorpay gateway
  async processRefund(
    paymentId: string | number,
    payload: ProcessRefundPayload,
  ): Promise<ProcessRefundResponse> {
    const response = await apiClient.post<ProcessRefundResponse>(
      `/payments/${paymentId}/refund`,
      payload,
    );

    return response.data;
  },

  async getPassengerTransactions({
    passengerId,
    page = 1,
    limit = 10,
    status,
  }: GetPassengerTransactionsParams): Promise<GetPassengerTransactionsResponse> {
    const response = await apiClient.get<GetPassengerTransactionsResponse>(
      `/payments/passenger/${passengerId}`,
      {
        params: {
          page,
          limit,
          status,
        },
      },
    );

    return response.data;
  },

  async getRefundRequests(params?: GetRefundRequestsParams): Promise<GetRefundRequestsResponse> {
    const response = await apiClient.get("/refund-requests", { params });
    return response.data;
  },

  
};
