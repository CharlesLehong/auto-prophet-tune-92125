-- Add columns to store CSV data and forecast results
ALTER TABLE saved_models 
ADD COLUMN csv_data jsonb,
ADD COLUMN forecast_results jsonb;