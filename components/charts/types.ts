export type RoleCode =
  | "SUPER_ADMIN"
  | "PLATFORM_ADMIN"
  | "GROUP_ADMIN"
  | "BRAND_ADMIN"
  | "REGIONAL_MANAGER"
  | "AREA_MANAGER"
  | "FRANCHISE_OWNER"
  | "BRANCH_MANAGER"
  | "FINANCE_MANAGER"
  | "OPERATIONS_MANAGER"
  | "HR_MANAGER"
  | "EMPLOYEE"
  | "AUDITOR";

export type MembershipRole =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "STAFF"
  | "VIEWER";

export interface ChartDataPoint {
  date?: string;
  value: number | string;
}

export interface SeriesConfig {
  label: string;
  data: ChartDataPoint[];
  color?: string;
  type?: "line" | "bar" | "area" | "pie";
  fill?: boolean;
  stack?: boolean;
  onClick?: () => void;
  active?: boolean;
}

export interface LegendItem {
  label: string;
  color: string;
}

export interface ChartExportOption {
  format: "png" | "svg" | "csv";
}

export interface ChartHeaderProps {
  title?: string;
  description?: string;
  actions?: ActionConfig;
}

export interface ChartLegendProps {
  items?: LegendItem[];
  position?: "top" | "right" | "bottom" | "left";
}

export interface ChartTooltipProps {
  formatter?: (value: unknown) => string;
}

export interface ChartEmptyStateProps {
  message?: string;
}

export interface ChartErrorStateProps {
  message?: string;
}

export interface ChartLoadingProps {
  isLoading?: boolean;
}

export interface ChartSkeletonProps {
  size?: number;
}

export interface ChartExportProps {
  filename?: string;
  format?: "png" | "svg" | "csv";
}
