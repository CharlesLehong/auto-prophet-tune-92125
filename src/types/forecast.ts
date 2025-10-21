export type ForecastModel = 'prophet' | 'autogluon';

export interface ProphetParameters {
  growth: 'linear' | 'logistic';
  changepoint_prior_scale: number;
  seasonality_mode: 'additive' | 'multiplicative';
  seasonality_prior_scale: number;
  yearly_seasonality: boolean | 'auto';
  changepoint_range: number;
  cv_initial: number;
  cv_period: number;
  cv_horizon: number;
}

export interface AutogluonParameters {
  prediction_length: number;
  eval_metric: string;
  num_val_windows: number;
}

export interface Regressor {
  name: string;
  prior_scale?: number;
  standardize?: boolean | string;
  mode?: 'additive' | 'multiplicative';
  lead_lag?: number;
}

export interface SegmentConfig {
  segment: string;
  segmentValue: string; // The value in the segment column that identifies this segment
  regressors: Regressor[];
  forecast_periods: number;
  frequency: string;
  total_records: number;
  training_records: number;
  test_records: number; // Number of recent records to exclude for testing
}

export interface ForecastConfig {
  model: ForecastModel;
  date_column: string;
  segment_column: string;
  dependent_variable: string;
  segments: SegmentConfig[];
  prophet_params?: ProphetParameters;
  autogluon_params?: AutogluonParameters;
}
