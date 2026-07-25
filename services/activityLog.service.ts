// services/activityLogService.ts
import { apiClient } from "@/lib/api";

export interface BackendActivityLog {
  id: number;
  user_id: number;
  action: string;
  description: string;
  entity_type: string;
  entity_id: number;
  ip_address: string;
  user_agent: string;
  status: "success" | "error" | "warning" | string;
  created_at: string | null;
  updated_at: string | null;
  user_name: string | null;
  user_email: string | null;
  role_name: string | null;
}

export interface LogPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse {
  status: string;
  data: BackendActivityLog[];
  pagination: LogPagination;
}

export interface ActivityLog {
  id: string;
  rawId: number;
  timestamp: string;
  actor: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  userAgent: string;
  status: "Success" | "Failed" | "Warning";
  metadata?: Record<string, unknown>;
}

export interface GetLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  entityType?: string;
}

const normalizeStatus = (statusStr: string): "Success" | "Failed" | "Warning" => {
  const s = statusStr?.toLowerCase();
  if (s === "success") return "Success";
  if (s === "error" || s === "failed") return "Failed";
  return "Warning";
};

const formatDate = (isoString: string | null): string => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export async function getActivityLogs(params: GetLogsParams = {}): Promise<{
  logs: ActivityLog[];
  pagination: LogPagination;
}> {
  const queryParams: Record<string, string | number> = {
    page: params.page || 1,
    limit: params.limit || 20,
  };

  if (params.search?.trim()) {
    queryParams.search = params.search.trim();
  }

  if (params.entityType && params.entityType !== "All") {
    queryParams.entity_type = params.entityType.toLowerCase();
  }

  // Uses configured apiClient; header Authorization is automatically attached
  const response = await apiClient.get<ApiResponse>("/activity-logs", {
    params: queryParams,
  });

  const result = response.data;

  const logs: ActivityLog[] = result.data.map((item) => ({
    id: `LOG-${item.id}`,
    rawId: item.id,
    timestamp: formatDate(item.created_at),
    actor: {
      id: item.user_id,
      name: item.user_name || `User #${item.user_id}`,
      email: item.user_email || "N/A",
      role: item.role_name || "System/Unknown",
    },
    action: item.action,
    description: item.description,
    entityType: item.entity_type || "System",
    entityId: item.entity_id ? `#${item.entity_id}` : "N/A",
    ipAddress: item.ip_address || "N/A",
    userAgent: item.user_agent || "Unknown Agent",
    status: normalizeStatus(item.status),
    metadata: {
      userId: item.user_id,
      rawEntityId: item.entity_id,
      rawEntityType: item.entity_type,
      updatedAt: item.updated_at,
      createdAt: item.created_at,
    },
  }));

  return { logs, pagination: result.pagination };
}