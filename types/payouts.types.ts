// Status options for payouts
export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

// Gateway options
export type PayoutGateway = "razorpay_x" | string;

// Item inside the List API
export interface PayoutListItem {
  id: number;
  payout_code: string;
  ride_id: number;
  driver_id: number;
  gross_amount: string;
  platform_fee: string;
  net_payout_amount: string;
  account_number: string;
  ifsc_code: string;
  status: PayoutStatus;
  payout_gateway: PayoutGateway;
  payout_id: string | null;
  failure_reason: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  driver_name: string;
  driver_phone: string;
  source_address: string;
  destination_address: string;
  ride_date: string;
}

// Single Payout Detail API item
export interface PayoutDetailItem {
  id: number;
  payout_code: string;
  ride_id: number;
  driver_id: number;
  gross_amount: string;
  platform_fee: string;
  net_payout_amount: string;
  account_number: string;
  ifsc_code: string;
  status: PayoutStatus;
  payout_gateway: PayoutGateway;
  payout_id: string | null;
  failure_reason: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  driver_name: string;
  driver_phone: string;
}

// Pagination Metadata
export interface PaginationInfo {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

// Optional Query Parameters for Listing Payouts
export interface GetPayoutsQueryParams {
  page?: number;
  limit?: number;
  status?: PayoutStatus;
  search?: string;
}

// API Response Wrappers
export interface GetPayoutsResponse {
  success: boolean;
  data: PayoutListItem[];
  pagination: PaginationInfo;
}

export interface GetPayoutDetailResponse {
  success: boolean;
  data: PayoutDetailItem;
}

export interface ProcessPayoutResultData {
  success: boolean;
  payoutCode: string;
  netPayoutAmount: string;
  gatewayPayoutId: string;
}

export interface ProcessPayoutResponse {
  success: boolean;
  message: string;
  data: ProcessPayoutResultData;
}