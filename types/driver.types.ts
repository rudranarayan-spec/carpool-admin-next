/* eslint-disable @typescript-eslint/no-explicit-any */
export type DriverStatus = "pending" |"active" | "inactive" | "blocked";

export type DocumentType =
  | 'license'
  | 'aadhar'
  | 'pan'
  | 'bank'
  | 'insurance'
  | 'registration'
  | 'background_check';

export interface VerifyDocumentRequest {
  driverId: number | string;
  docType: DocumentType;
  status: DocumentVerificationStatus;
}
export type DocumentVerificationStatus = 'pending' | 'approved' | 'rejected';

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

export interface VerifyDocumentRequest {
  driverId: number | string;
  docType: DocumentType;
  status: DocumentVerificationStatus;
}

// Allowed status values for driver overall status update
export type DriverOverallStatus = 'active' | 'blocked' | 'rejected';

// Request body for update-driver-status API
export interface UpdateDriverStatusRequest {
  driverId: number | string;
  status: DriverOverallStatus;
}

// Standard API Response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}



export interface DriverDocument {
  id: string;
  name: string;
  type: "license" | "aadhar" | "pan" | "bank";
  url: string;
  status: "pending" | "approved" | "rejected";
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
  total_vehicles: number;
  total_rides: number;
  documents: DriverDocument[];
}

export interface PendingDriversResponse {
  success: boolean;
  message: string;
  data: Driver[];
  total: number;
}

export interface GetPendingDriversParams {
  page?: number;
  limit?: number;
  search?: string;
}


export interface AddressDetails {
  city: string;
  state: string;
  country: string;
  postal_code: string;
  address: string;
}

export interface DriverDocuments {
  driver_license: string;
  is_dl_verified: "pending" | "approved" | "rejected";
  adhhar_card: string;
  is_adhhar_verified: "pending" | "approved" | "rejected";
  pan_card: string;
  is_pan_verified: "pending" | "approved" | "rejected";
  bank_account: string;
  is_account_verified: "pending" | "approved" | "rejected";
  bank_account_holder: string;
  bank_account_number: string;
  bank_account_ifsc: string;
  bank_name: string;
  profile_picture: string;
  is_verified: string;
  status: string;
}

export interface Vehicle {
  id: number;
  model: string;
  registration_number: string;
  fuel_type: string;
  color: string;
  status: string;
}

export interface Ride {
  id: number;
  vehicle_id: number;
  source_address: string;
  destination_address: string;
  source_lat: string;
  source_lng: string;
  destination_lat: string;
  destination_lng: string;
  ride_date: string;
  departure_time: string;
  distance_meters: number;
  duration_seconds: number;
  price_per_seat: string;
  total_seats: number;
  available_seats: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  created_at: string;
}

export interface DriverDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
  address_details: AddressDetails;
  documents: DriverDocuments;
  vehicles: Vehicle[];
  rides: Ride[];
}

export interface DriverDetailsApiResponse {
  success: boolean;
  data: DriverDetails;
}




// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface DriverDocumentBriefing {
  id: string | number;
  type: 'dl' | 'aadhaar' | 'pan' | 'rc' | 'insurance' | string;
  title: string;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  [key: string]: any; // Allows additional properties in the future
}

export interface BankDetails {
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  ifsc_code?: string;
  [key: string]: any;
}

export interface AddressDetails2 {
  current_address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  permanent_address?: string;
  [key: string]: any;
}

export interface DriverDetailDataBrief {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked' | string;
  total_vehicles?: number;
  total_rides?: number;
  total_earnings?: number;
  address_details?: AddressDetails2 | null;
  bank_details?: BankDetails | null;
  documents?: DriverDocumentBriefing[];
  [key: string]: any;
}