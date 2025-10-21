export interface ForecastPoint {
  date: string;
  actual?: number;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
  is_test?: boolean;
  is_forecast?: boolean;
}

export interface SegmentForecastResult {
  segment: string;
  segmentValue: string;
  training_data: ForecastPoint[];
  test_data: ForecastPoint[];
  forecast_data: ForecastPoint[];
  metrics?: {
    mae?: number;
    rmse?: number;
    mape?: number;
    mse?: number;
    r2?: number;
    coverage?: number;
    smape?: number;
    mase?: number;
  };
  ai_commentary?: string;
}

export interface ForecastResults {
  segments: SegmentForecastResult[];
  model: string;
  timestamp: string;
}
