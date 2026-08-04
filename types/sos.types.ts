export interface SosAlertItem {
  id: number;
  ride_id: number;
  user_id: number;
  user_type: "passenger" | "driver";
  latitude: string;
  longitude: string;
  status: "triggered" | "acknowledged" | "resolved";
  resolved_by: number | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_phone: string;
  resolved_by_name?: string | null;
  ride_date?: string;
  departure_time?: string;
  source_address?: string;
  destination_address?: string;
}

export interface GetSosParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface GetSosResponse {
  success: boolean;
  data: SosAlertItem[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface GetSosByIdResponse {
  success: boolean;
  data: SosAlertItem;
}

export interface UpdateSosStatusPayload {
  status: "triggered" | "acknowledged" | "resolved";
  resolution_notes?: string;
}

export interface UpdateSosStatusResponse {
  success: boolean;
  message: string;
}
