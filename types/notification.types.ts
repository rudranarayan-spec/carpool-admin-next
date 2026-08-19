/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DeviceStats {
  total_devices: number;
  active_devices: string | number;
  web_devices: string | number;
  android_devices: string | number;
  ios_devices: string | number;
}

export interface NotificationStats {
  devices: DeviceStats;
  notifications: {
    total_notifications: number;
  };
}

export interface NotificationItem {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string;
  data: string; // Backend returns JSON string: "{\"screen\":\"about\"}"
  is_read: number;
  read_at: string | null;
  created_at: string;
}

export interface DeviceItem {
  id: number;
  user_id: number;
  installation_id: string;
  platform: "web" | "android" | "ios" | string;
  device_type: string | null;
  browser: string | null;
  app_version: string | null;
  permission_status: string;
  is_active: number;
  last_registered_at: string;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface ApiPaginatedResponse<T> {
  status: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

export interface BroadcastPayload {
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
}

export interface BroadcastResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    totalDevices: number;
    sent: number;
    failed: number;
    results: Array<{
      successCount: number;
      failureCount: number;
    }>;
  };
}