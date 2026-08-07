// Query Parameters for Analytics Endpoint
export interface AnalyticsQueryParams {
  timeframe?: "24H" | "7D" | "30D" | "90D";
  comparison?: "vs_previous" | "vs_prior_year";
}

// KPI Data Types
export interface TotalRevenueKPI {
  label: string;
  value: number;
  currency: string;
  formatted_value: string;
  percentage_change: number;
  is_positive: boolean;
  comparison_label: string;
}

export interface RidesConversionRateKPI {
  label: string;
  value: number;
  unit: string;
  formatted_value: string;
  percentage_change: number;
  is_positive: boolean;
  sub_text: string;
}

export interface ActivePlatformUsersKPI {
  label: string;
  value: number;
  formatted_value: string;
  percentage_change: number;
  is_positive: boolean;
  breakdown: {
    riders: string;
    drivers: string;
  };
}

export interface AvgOccupancyRateKPI {
  label: string;
  value: number;
  max_capacity: number;
  formatted_value: string;
  change_value: number;
  is_positive: boolean;
  change_unit: string;
  target_text: string;
}

export interface AnalyticsKPIs {
  total_revenue: TotalRevenueKPI;
  rides_conversion_rate: RidesConversionRateKPI;
  active_platform_users: ActivePlatformUsersKPI;
  avg_occupancy_rate: AvgOccupancyRateKPI;
}

// Booking Velocity Chart Data Types
export interface BookingVelocityDataPoint {
  day: string;
  prior_period_target: number;
  rides_booked: number;
  rides_published: number;
}

export interface BookingVelocity {
  title: string;
  description: string;
  average_fill_yield: number;
  chart_data: BookingVelocityDataPoint[];
}

// Capacity Breakdown Donut Chart Data Types
export interface CapacitySegment {
  key: "full" | "partial" | "solo" | "cancelled";
  label: string;
  percentage: number;
  count: number;
  formatted_count: string;
  color: string;
}

export interface CapacityBreakdown {
  title: string;
  description: string;
  total_rides: number;
  formatted_total_rides: string;
  segments: CapacitySegment[];
}

// Main Analytics Platform Performance Response Payload
export interface PlatformPerformanceData {
  overview: {
    timeframe: string;
    comparison: string;
    title: string;
    subtitle: string;
    last_updated: string;
  };
  kpis: AnalyticsKPIs;
  booking_velocity: BookingVelocity;
  capacity_breakdown: CapacityBreakdown;
}

// General API Wrapper Response
export interface AnalyticsApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}