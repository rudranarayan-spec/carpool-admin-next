import { apiClient } from "@/lib/api";
import {
  ApiResponse,
  ApiPaginatedResponse,
  NotificationStats,
  NotificationItem,
  DeviceItem,
  BroadcastPayload,
  BroadcastResponse,
} from "@/types/notification.types";

export const NotificationService = {
  // 1. GET Admin Stats
  getStats: async () => {
    const res = await apiClient.get<ApiResponse<NotificationStats>>(
      "/admin/notifications/stats",
    );
    return res.data;
  },

  // 2. GET Notifications List
  getNotifications: async (page = 1, limit = 20) => {
    const res = await apiClient.get<ApiPaginatedResponse<NotificationItem>>(
      "/admin/notifications",
      { params: { page, limit } },
    );
    return res.data;
  },

  // 3. GET Devices List
  getDevices: async (page = 1, limit = 20) => {
    const res = await apiClient.get<ApiPaginatedResponse<DeviceItem>>(
      "/admin/notifications/devices",
      { params: { page, limit } },
    );
    return res.data;
  },

  // 4. GET Device by ID
  getDeviceById: async (id: number | string) => {
    const res = await apiClient.get<ApiResponse<DeviceItem>>(
      `/admin/notifications/device/${id}`,
    );
    return res.data;
  },

  // 5. GET Notification by ID
  getNotificationById: async (id: number | string) => {
    const res = await apiClient.get<ApiResponse<NotificationItem>>(
      `/admin/notifications/${id}`,
    );
    return res.data;
  },

  // 6. POST Broadcast Notification
  broadcast: async (payload: BroadcastPayload) => {
    const res = await apiClient.post<BroadcastResponse>(
      "/admin/notifications/broadcast",
      payload,
    );
    return res.data;
  },
};

export async function registerNotificationDevice(pushToken: string) {
  let installationId = localStorage.getItem("installation_id");
  if (!installationId) {
    installationId = crypto.randomUUID();
    localStorage.setItem("installation_id", installationId);
  }

  return apiClient.post("/notifications/devices", {
    installationId,
    pushToken,
    platform: "web",
    deviceType: "desktop",
    browser: navigator.userAgent,
    appVersion: "admin-web-v1",
    permissionStatus: Notification.permission,
  });
}
