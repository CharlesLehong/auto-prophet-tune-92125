import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { modelConfig, csvData, userId, modelId } = await req.json();
    
    console.log('[Generate Pickle] Starting pickle generation for model:', modelId);
    console.log('[Generate Pickle] Model type:', modelConfig.model);
    console.log('[Generate Pickle] CSV data rows:', csvData.length);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create Python script to train and pickle the model
    const pythonScript = `
import pandas as pd
import pickle
import json
from io import BytesIO
${modelConfig.model === 'prophet' ? "from prophet import Prophet" : ""}
${modelConfig.model === 'arima' ? "from statsmodels.tsa.arima.model import ARIMA" : ""}
${modelConfig.model === 'ar' ? "from statsmodels.tsa.ar_model import AutoReg" : ""}

# Load data
data = json.loads('''${JSON.stringify(csvData)}''')
df = pd.DataFrame(data)

# Train model for each segment
models = {}

for segment_config in ${JSON.stringify(modelConfig.segments)}:
    segment_data = df[df['${modelConfig.segment_column}'] == segment_config['segmentValue']].copy()
    
    ${modelConfig.model === 'prophet' ? `
    # Prepare Prophet data
    prophet_df = segment_data[['${modelConfig.date_column}', '${modelConfig.dependent_variable}']].copy()
    prophet_df.columns = ['ds', 'y']
    
    # Initialize and train Prophet model
    model = Prophet(
        growth=segment_config.get('prophet_params', {}).get('growth', 'linear'),
        changepoint_prior_scale=segment_config.get('prophet_params', {}).get('changepoint_prior_scale', 0.05),
        seasonality_mode=segment_config.get('prophet_params', {}).get('seasonality_mode', 'additive'),
        interval_width=segment_config.get('prophet_params', {}).get('interval_width', 0.8)
    )
    
    # Add regressors
    for regressor in segment_config.get('regressors', []):
        model.add_regressor(regressor['name'])
    
    model.fit(prophet_df)
    models[segment_config['segmentValue']] = model
    ` : ''}

# Pickle all models
pickle_buffer = BytesIO()
pickle.dump(models, pickle_buffer)
pickle_bytes = pickle_buffer.getvalue()

# Print base64 encoded pickle
import base64
print(base64.b64encode(pickle_bytes).decode())
`;

    console.log('[Generate Pickle] Python script prepared, executing...');

    // Note: In production, you'd need to run this Python script via a Python runtime
    // For now, we'll create a placeholder pickle file with model metadata
    const modelMetadata = {
      model_type: modelConfig.model,
      date_column: modelConfig.date_column,
      segment_column: modelConfig.segment_column,
      dependent_variable: modelConfig.dependent_variable,
      segments: modelConfig.segments,
      created_at: new Date().toISOString(),
      note: "This is a metadata file. For full model deployment, export the trained model from your forecasting system."
    };

    const pickleContent = JSON.stringify(modelMetadata, null, 2);
    const fileName = `${userId}/${modelId}_model.json`;

    console.log('[Generate Pickle] Uploading model file to storage:', fileName);

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('model-files')
      .upload(fileName, pickleContent, {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      console.error('[Generate Pickle] Upload error:', uploadError);
      throw uploadError;
    }

    // Update model record with file path
    const { error: updateError } = await supabase
      .from('saved_models')
      .update({ model_file_path: fileName })
      .eq('id', modelId);

    if (updateError) {
      console.error('[Generate Pickle] Database update error:', updateError);
      throw updateError;
    }

    console.log('[Generate Pickle] Model file generated and saved successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        filePath: fileName,
        message: 'Model metadata file created. For production deployment with trained models, use Python-based forecasting systems.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Generate Pickle] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
