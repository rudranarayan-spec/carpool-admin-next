export type VerificationStatus = "active" | "inactive" | "pending" | "blocked";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetVehiclesParams {
  page?: number;
  limit?: number;
  status?: VerificationStatus;
  search?: string;
}

// Summary object returned in the list endpoint (/vehicles)
export interface VehicleListItem {
  id: number;
  driver_id: number;
  driver_name: string;
  driver_email: string;
  driver_phone: string;
  model: string;
  registration_number: string;
  fuel_type: string;
  color: string;
  status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

// Full detail object returned in single endpoint (/vehicles/:id)
export interface VehicleDetail {
  id: number;
  user_id: number;
  vehicle_type: string;
  brand: string;
  model: string;
  manufacture_year: number;
  registration_number: string;
  rc_number: string;
  rc_expiry_date: string;
  insurance_provider: string;
  policy_number: string;
  front_image: string | null;
  is_front_image_verified: VerificationStatus;
  back_image: string | null;
  is_back_image_verified: VerificationStatus;
  side_image: string | null;
  is_side_image_verified: VerificationStatus;
  number_plate_image: string | null;
  is_number_plate_verified: VerificationStatus;
  color: string;
  seats: number;
  available_seats: number;
  rc_file: string | null;
  is_rc_verified: VerificationStatus;
  insurance_file: string | null;
  is_insurance_verified: VerificationStatus;
  insurance_expiry: string;
  vehicle_images: string[] | null;
  features: string[] | null;
  fuel_type: string;
  rating: number | null;
  status: VerificationStatus;
  created_at: string;
  updated_at: string;
  driver_name: string;
  driver_email: string;
  driver_phone: string;
}

export interface UpdateVehicleStatusPayload {
  status: VerificationStatus;
  reason?: string;
}

// Common API Response wrappers
export interface VehicleListResponse {
  success: boolean;
  data: VehicleListItem[];
  pagination: Pagination;
}

export interface VehicleDetailResponse {
  success: boolean;
  data: VehicleDetail;
}

export interface UpdateVehicleStatusResponse {
  success: boolean;
  message?: string;
  data?: VehicleDetail;
}

export interface Vehicle {
  id: number;
  driver_id: number;
  model: string;
  registration_number: string;
  fuel_type: string;
  color: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface UserVehiclesResponse {
  success: boolean;
  message?: string;
  data: VehicleListItem[]; 
}

