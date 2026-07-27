export interface Driver {
  driver_name: string;
  driver_email: string;
  driver_phone: string;
  driver_profile_picture?: string;
}

export interface Vehicle {
  vehicle_model: string;
  vehicle_registration_number: string;
  vehicle_fuel_type: string;
  vehicle_color?: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
}
export type RideStatus = "scheduled" | "in_progress" | "in progress" | "completed" | "cancelled" | string;
// Minimal Ride interface for list view (matches optimized SQL query)
export interface RideListItem extends Driver, Vehicle {
  id: number;
  driver_id: number;
  vehicle_id: number;
  source_address: string;
  destination_address: string;
  price_per_seat: string;
  total_seats: number;
  available_seats: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  ride_date: string;
  departure_time: string;
}

// Complete Ride interface for single details view / admin operations
export interface RideDetails extends RideListItem {
  source_place_id?: string;
  destination_place_id?: string;
  source_lat?: string;
  source_lng?: string;
  destination_lat?: string;
  destination_lng?: string;
  polyline?: string;
  route_points?: RoutePoint[] | string;
  distance_meters?: number;
  duration_seconds?: number;
  estimated_reach_time?: string;
  pet_allowed?: 'yes' | 'no';
  smoking_allowed?: 'yes' | 'no';
  instant_booking?: 'yes' | 'no';
  max_two_in_back?: 'yes' | 'no';
  created_at?: string;
  updated_at?: string;
}

// For backwards compatibility
export type Ride = RideDetails;

// Payload for creating a new ride
export interface CreateRidePayload {
  driver_id: number;
  vehicle_id: number;
  source_address: string;
  source_place_id?: string;
  destination_address: string;
  destination_place_id?: string;
  source_lat?: string;
  source_lng?: string;
  destination_lat?: string;
  destination_lng?: string;
  ride_date: string;
  departure_time: string;
  polyline?: string;
  route_points?: RoutePoint[];
  distance_meters?: number;
  duration_seconds?: number;
  estimated_reach_time?: string;
  pet_allowed?: 'yes' | 'no';
  smoking_allowed?: 'yes' | 'no';
  instant_booking?: 'yes' | 'no';
  max_two_in_back?: 'yes' | 'no';
  price_per_seat: string;
  total_seats: number;
  available_seats?: number;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'in_progress';
}

// Partial payload for updating an existing ride
export type UpdateRidePayload = Partial<CreateRidePayload>;

// Generic API response shapes
export interface FetchRidesResponse {
  status: 'success' | 'fail' | 'error';
  data: RideListItem[];
}

export interface FetchSingleRideResponse {
  status: 'success' | 'fail' | 'error';
  data: RideDetails;
}

export interface MutationRideResponse {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: {
    ride?: RideListItem; 
    ride_id?: number;
  };
}