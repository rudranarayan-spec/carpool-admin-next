export interface RatingItem {
  id: number;
  ride_id: number;
  booking_id: number;
  passenger_id: number;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
  passenger_name: string;
  passenger_phone: string;
  ride_date: string;
  source_address: string;
  destination_address: string;
  driver_name: string;
}

export interface RatingsPagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface GetRatingsResponse {
  success: boolean;
  data: RatingItem[];
  pagination: RatingsPagination;
}

export interface GetRatingsParams {
  page?: number;
  limit?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface DeleteRatingResponse {
  success: boolean;
  message: string;
}