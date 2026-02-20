// Forecasting model types
export type ForecastModel = "prophet" | "autogluon" | "arima" | "ar" | "arma";

// Data frequency types
export type DataFrequency = "D" | "W" | "MS" | "QS" | "YS";

// Performance metrics
export type PerformanceMetric =
  | "mae"
  | "rmse"
  | "mape"
  | "mse"
  | "r_squared"
  | "adjusted_r_squared"
  | "coverage"
  | "smape"
  | "mase";

// Regressor configuration
export interface RegressorConfig {
  name: string;
  enabled: boolean;
  mode: "additive" | "multiplicative";
  standardize: boolean;
}

// Custom seasonality configuration
export interface SeasonalityConfig {
  name: string;
  period: number;
  fourierOrder: number;
  mode: "additive" | "multiplicative";
}

// Segment configuration for multi-segment forecasting
export interface SegmentConfig {
  segmentName: string;
  trainRecords: number;
  testRecords: number;
  forecastPeriods: number;
  frequency: DataFrequency;
  regressors: RegressorConfig[];
  startDate?: string;
  endDate?: string;
}

// Prophet-specific parameters
export interface ProphetParameters {
  // Growth
  growthType: "linear" | "logistic" | "flat";
  cap?: number;
  floor?: number;

  // Changepoints
  changepointPriorScale: number;
  changepointRange: number;
  nChangepoints: number;
  changepoints?: string[];

  // Seasonality
  yearlySeasonality: boolean | "auto" | number;
  weeklySeasonality: boolean | "auto" | number;
  dailySeasonality: boolean | "auto" | number;
  seasonalityMode: "additive" | "multiplicative";
  seasonalityPriorScale: number;

  // Holidays
  holidayPriorScale: number;
  holidays?: string;
  countryHolidays?: string;

  // Uncertainty
  intervalWidth: number;
  uncertaintySamples: number;

  // Custom seasonalities
  customSeasonalities: SeasonalityConfig[];
}

// Complete forecast configuration
export interface ForecastConfig {
  model: ForecastModel;
  dateColumn: string;
  segmentColumn: string;
  dependentVariable: string;
  segments: SegmentConfig[];
  prophetParams: ProphetParameters;
  selectedMetrics: PerformanceMetric[];
}

// Default Prophet parameters
export const defaultProphetParams: ProphetParameters = {
  growthType: "linear",
  changepointPriorScale: 0.05,
  changepointRange: 0.8,
  nChangepoints: 25,
  yearlySeasonality: "auto",
  weeklySeasonality: "auto",
  dailySeasonality: "auto",
  seasonalityMode: "additive",
  seasonalityPriorScale: 10,
  holidayPriorScale: 10,
  intervalWidth: 0.8,
  uncertaintySamples: 1000,
  customSeasonalities: [],
};

// Frequency display names
export const frequencyNames: Record<DataFrequency, string> = {
  D: "Daily",
  W: "Weekly",
  MS: "Monthly",
  QS: "Quarterly",
  YS: "Yearly",
};

// Metric display names
export const metricNames: Record<PerformanceMetric, string> = {
  mae: "Mean Absolute Error",
  rmse: "Root Mean Squared Error",
  mape: "Mean Absolute Percentage Error",
  mse: "Mean Squared Error",
  r_squared: "R-Squared",
  adjusted_r_squared: "Adjusted R-Squared",
  coverage: "Prediction Interval Coverage",
  smape: "Symmetric MAPE",
  mase: "Mean Absolute Scaled Error",
};
