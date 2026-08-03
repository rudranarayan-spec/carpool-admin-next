// types/payment.ts

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentTransactionRaw {
  id: number;
  booking_code: string;
  booking_id: string;
  order_id: string;
  ride_id?: string | number | null;
  seat_booked?: number | null;
  source?: string | null;
  destination?: string | null;
  payment_id: string | null;
  amount: number;
  refund_id: string | null;
  refunded_at: string | null;
  payment_status:
    | "paid"
    | "unpaid"
    | "failed"
    | "refunded"
    | "partially_refunded"
    | "refund_requested"
    | string;
  payment_gateway: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentStats {
  gross_fare: number;
  admin_revenue: number;
  driver_payouts: number;
  platform_percent: number;
  driver_percent: number;
}

export interface GetAdminPaymentsResponse {
  success: boolean;
  message: string;
  data: PaymentTransactionRaw[];
  pagination: Pagination;
  stats: PaymentStats;
}

export interface GetAdminPaymentsParams {
  page?: number;
  limit?: number;
  status?: string;
  passengerId?: string | number;
  search?: string;
}

export interface GetAdminPaymentByIdResponse {
  success: boolean;
  message: string;
  data: PaymentTransactionRaw;
}

export interface UpdatePaymentStatusPayload {
  payment_status: string;
  refund_id?: string;
  refunded_at?: string;
}

export interface UpdatePaymentStatusResponse {
  success: boolean;
  message: string;
}

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

export interface RefundRequestItem {
  refund_table_id: number;
  booking_id: number;
  refund_amount: number;
  reason_of_refund: string;
  refund_status: "requested" | "processing" | "processed" | "failed";
  razorpay_refund_id: string | null;
  requested_at: string;
  updated_at: string;
  booking_code: string;
  payment_db_id: number;
  razorpay_payment_id: string;
  original_payment_amount: number;
  payment_status: string;
}