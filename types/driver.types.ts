export type DriverStatus = "pending" |"active" | "inactive" | "blocked";

// Adjust properties to match your database schema
export interface DriverListItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  role: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface DriverDetail extends DriverListItem {
  rc_number?: string;
  rc_file?: string;
  insurance_file?: string;
  front_image?: string;
  back_image?: string;
  side_image?: string;
  number_plate_image?: string;
  [key: string]: unknown;
}

export interface GetAllDriversParams {
  page?: number;
  limit?: number;
  status?: DriverStatus;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetDriversResponse {
  status: "success" | "error";
  data: DriverListItem[];
  pagination?: PaginationMeta;
  message?: string;
}

export interface GetDriverByIdResponse {
  status: "success" | "error";
  data: DriverDetail;
  message?: string;
}

export interface UpdateDriverStatusPayload {
  status: DriverStatus;
}

export interface UpdateDriverStatusResponse {
  status: "success" | "error";
  message: string;
}

// Add this interface to your rides.types.ts file
export interface DriverRideItem {
  id: number;
  source_address: string;
  destination_address: string;
  price_per_seat: string;
  status: string;
  total_seats: number;
  available_seats: number;
  ride_date: string;
  departure_time: string;
  vehicle_id: number;
  vehicle_model: string;
  vehicle_registration_number: string;
  vehicle_fuel_type: string;
}

export interface FetchDriverRidesResponse {
  success: boolean;
  count: number;
  data: DriverRideItem[];
}