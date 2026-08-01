// Shared Pagination Structure
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ------------------------------------------
// Admin Payments Endpoint Types
// ------------------------------------------

/** Raw Payment Transaction object returned by GET /admin/payments */
export interface PaymentTransactionRaw {
  id: number;
  booking_code: string;
  booking_id: string;
  order_id: string;
  payment_id: string | null;
  amount: number;
  refund_id: string | null;
  refunded_at: string | null;
  payment_status: "paid" | "unpaid" | "failed" | "refunded" | "partially_refunded" | string;
  payment_gateway: string;
  created_at: string;
  updated_at: string;
}

export interface GetAdminPaymentsResponse {
  success: boolean;
  message: string;
  data: PaymentTransactionRaw[];
  pagination: Pagination;
}

export interface GetAdminPaymentsParams {
  page?: number;
  limit?: number;
  status?: string;
  passengerId?: string | number;
  search?: string;
}

/** Response for GET /admin/payments/:id */
export interface GetAdminPaymentByIdResponse {
  success: boolean;
  message: string;
  data: PaymentTransactionRaw;
}

// ------------------------------------------
// Update Payment Status Types (PATCH)
// ------------------------------------------

export interface UpdatePaymentStatusPayload {
  payment_status: string;
  refund_id?: string;
  refunded_at?: string;
}

export interface UpdatePaymentStatusResponse {
  success: boolean;
  message: string;
}

// ------------------------------------------
// Process Refund Types (POST)
// ------------------------------------------

export interface ProcessRefundPayload {
  refund_amount?: number;
  reason_of_refund?: string;
}

export interface ProcessRefundResponseData {
  refund_table_id: number;
  razorpay_refund_id: string;
  amount: number;
  status: string;
}

export interface ProcessRefundResponse {
  success: boolean;
  message: string;
  data: ProcessRefundResponseData;
}

// ------------------------------------------
// Passenger Transactions Endpoint Types
// ------------------------------------------

/** Passenger Transaction object returned by GET /payments/passenger/:passengerId */
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