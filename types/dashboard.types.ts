export interface MetricItem {
  value: number;
  percentage_change?: number;
  comparison_period?: string;
  status_label?: string;
  currency?: string;
  last_updated?: string;
}

export interface DashboardMetrics {
  active_live_rides: MetricItem;
  total_trips_today: MetricItem;
  pending_approvals: MetricItem;
  platform_revenue: MetricItem;
}

export interface DailyRideDemand {
  day: string;
  date: string;
  volume: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  live_ride_demand: DailyRideDemand[];
  recent_activities: RecentActivity[];
}

export interface DashboardBootstrapResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}