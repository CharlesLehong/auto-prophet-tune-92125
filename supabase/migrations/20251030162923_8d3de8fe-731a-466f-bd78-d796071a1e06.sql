-- Create storage bucket for model pickle files
INSERT INTO storage.buckets (id, name, public)
VALUES ('model-files', 'model-files', false);

-- Create RLS policies for model files
CREATE POLICY "Users can view their own model files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'model-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own model files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'model-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own model files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'model-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own model files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'model-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add column to store pickle file path
ALTER TABLE saved_models
ADD COLUMN model_file_path text;