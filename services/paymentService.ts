import { apiClient } from "@/lib/api";

export interface PassengerTransaction {
  payment_table_id: number;
  booking_code: string;
  booking_id: string;
  order_id: string;
  payment_id: string | null;
  refund_id: string | null;
  refunded_at: string | null;
  payment_status: "paid" | "unpaid" | "failed" | "refunded" | string;
  payment_gateway: string;
  payment_created_at: string;
  passenger_id: number;
  ride_source: string;
  ride_destination: string;
  total_price: string;
  seats: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPassengerTransactionsResponse {
  success: boolean;
  message: string;
  data: PassengerTransaction[];
  pagination: Pagination;
}

export interface GetPassengerTransactionsParams {
  passengerId: string | number;
  page?: number;
  limit?: number;
  status?: string;
}

// ==========================================
// SERVICE API METHODS
// ==========================================

export const paymentService = {
  /**
   * Fetch payment transaction history for a specific passenger
   * 
   * Endpoint: GET /payments/passenger/:passengerId
   */
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
      }
    );

    return response.data;
  },
};