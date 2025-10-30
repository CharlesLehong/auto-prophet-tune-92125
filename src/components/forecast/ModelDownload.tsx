import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ForecastConfig } from "@/types/forecast";

interface ModelDownloadProps {
  modelId?: string;
  modelName: string;
  config: ForecastConfig;
  csvData: any[];
}

export function ModelDownload({ modelId, modelName, config, csvData }: ModelDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [modelFilePath, setModelFilePath] = useState<string | null>(null);

  const handleGeneratePickle = async () => {
    if (!modelId) {
      toast.error("Please save the model first");
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in");
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-model-pickle', {
        body: {
          modelConfig: config,
          csvData,
          userId: user.id,
          modelId
        }
      });

      if (error) throw error;

      setModelFilePath(data.filePath);
      toast.success("Model file generated successfully!");
    } catch (error) {
      console.error("Error generating pickle:", error);
      toast.error("Failed to generate model file");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!modelFilePath) {
      toast.error("No model file available");
      return;
    }

    setIsDownloading(true);
    try {
      const { data, error } = await supabase.storage
        .from('model-files')
        .download(modelFilePath);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${modelName.replace(/\s+/g, '_')}_model.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Model file downloaded!");
    } catch (error) {
      console.error("Error downloading model:", error);
      toast.error("Failed to download model file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Deployment</CardTitle>
        <CardDescription>
          Export your trained model for production deployment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={handleGeneratePickle}
            disabled={isGenerating || !modelId}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Model File
              </>
            )}
          </Button>
          {modelFilePath && (
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              className="flex-1"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Model
                </>
              )}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The model file contains configuration and metadata for deployment. 
          For production use with trained models, integrate with Python-based forecasting systems.
        </p>
      </CardContent>
    </Card>
  );
}
