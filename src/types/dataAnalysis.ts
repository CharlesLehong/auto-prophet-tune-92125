export interface StationarityTestResult {
  test_statistic: number;
  p_value: number;
  critical_values: Record<string, number>;
  is_stationary: boolean;
  recommendation: string;
}

export interface ACFResult {
  lags: number[];
  correlations: number[];
  confidence_interval: number;
}

export interface PACFResult {
  lags: number[];
  correlations: number[];
  confidence_interval: number;
}

export interface DataTransformation {
  type: 'log' | 'difference' | 'seasonal_difference' | 'box_cox' | 'custom';
  parameters?: Record<string, any>;
  applied: boolean;
}

export interface DataAnalysisResults {
  stationarity_test?: StationarityTestResult;
  acf?: ACFResult;
  pacf?: PACFResult;
  transformations: DataTransformation[];
  ai_insights?: string;
}
