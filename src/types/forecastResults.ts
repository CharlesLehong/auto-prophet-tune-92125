import type { PerformanceMetric, DataFrequency } from "./forecast";

// Single forecast data point
export interface ForecastPoint {
  date: string;
  actual: number | null;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  isForecast: boolean;
  isTestSet: boolean;
}

// Metrics calculation result
export interface MetricsResult {
  metric: PerformanceMetric;
  trainValue: number | null;
  testValue: number | null;
}

// Transformation applied to data
export interface AppliedTransformation {
  type: "log" | "difference" | "seasonal_difference" | "sqrt" | "box_cox";
  order?: number;
  seasonalPeriod?: number;
  lambda?: number;
}

// Single segment forecast result
export interface SegmentForecastResult {
  segmentName: string;
  frequency: DataFrequency;
  forecastData: ForecastPoint[];
  metrics: MetricsResult[];
  transformationsApplied: AppliedTransformation[];
  aiCommentary?: string;
  modelConfig: Record<string, unknown>;
  trainStartDate: string;
  trainEndDate: string;
  testStartDate?: string;
  testEndDate?: string;
  forecastStartDate: string;
  forecastEndDate: string;
}

// Complete forecast results
export interface ForecastResults {
  timestamp: string;
  modelType: string;
  segmentResults: SegmentForecastResult[];
  overallSummary?: string;
}

// Export format options
export type ExportFormat = "csv" | "json" | "html" | "pdf";

// Chart display options
export interface ChartOptions {
  showActual: boolean;
  showPredicted: boolean;
  showConfidenceInterval: boolean;
  showTrainTestSplit: boolean;
  chartHeight: number;
}

export const defaultChartOptions: ChartOptions = {
  showActual: true,
  showPredicted: true,
  showConfidenceInterval: true,
  showTrainTestSplit: true,
  chartHeight: 400,
};
