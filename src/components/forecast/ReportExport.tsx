import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import type { ForecastResults } from "@/types/forecastResults";
import type { ForecastConfig } from "@/types/forecast";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

interface ReportExportProps {
  results: ForecastResults;
  config: ForecastConfig;
  csvData?: any[];
  modelId?: string;
  modelName?: string;
}

export function ReportExport({ results, config, csvData, modelId, modelName }: ReportExportProps) {
  const saveReportToDatabase = async (reportData: any, reportName: string, reportType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save reports");
        return;
      }

      const { error } = await supabase
        .from("forecast_reports")
        .insert({
          user_id: user.id,
          model_id: modelId || null,
          report_name: reportName,
          report_type: reportType,
          report_data: reportData,
        });

      if (error) throw error;
      toast.success("Report saved to database");
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("Failed to save report to database");
    }
  };

  const exportDetailedCSV = async () => {
    try {
      const exportData: any[] = [];
      const timestamp = new Date().toISOString();
      
      // Add configuration header section
      exportData.push({ Section: "FORECAST CONFIGURATION" });
      exportData.push({ Section: "Report Generated", Value: timestamp });
      exportData.push({ Section: "Model Name", Value: modelName || "Unsaved Model" });
      exportData.push({ Section: "Model Type", Value: config.model });
      exportData.push({ Section: "Date Column", Value: config.date_column });
      exportData.push({ Section: "Segment Column", Value: config.segment_column });
      exportData.push({ Section: "Dependent Variable", Value: config.dependent_variable });
      exportData.push({ Section: "Performance Metrics", Value: config.performance_metrics.join(", ") });
      exportData.push({});

      // Add model-specific parameters
      if (config.model === 'prophet' && config.prophet_params) {
        exportData.push({ Section: "PROPHET PARAMETERS" });
        Object.entries(config.prophet_params).forEach(([key, value]) => {
          exportData.push({ Section: key, Value: JSON.stringify(value) });
        });
        exportData.push({});
      } else if (config.model === 'autogluon' && config.autogluon_params) {
        exportData.push({ Section: "AUTOGLUON PARAMETERS" });
        Object.entries(config.autogluon_params).forEach(([key, value]) => {
          exportData.push({ Section: key, Value: JSON.stringify(value) });
        });
        exportData.push({});
      } else if (config.traditional_params) {
        exportData.push({ Section: "MODEL PARAMETERS" });
        Object.entries(config.traditional_params).forEach(([key, value]) => {
          exportData.push({ Section: key, Value: JSON.stringify(value) });
        });
        exportData.push({});
      }

      // Add segment configurations
      exportData.push({ Section: "SEGMENT CONFIGURATIONS" });
      config.segments.forEach((seg, idx) => {
        exportData.push({ Section: `Segment ${idx + 1}`, Value: seg.segment });
        exportData.push({ Section: "Segment Value", Value: seg.segmentValue });
        exportData.push({ Section: "Forecast Periods", Value: seg.forecast_periods });
        exportData.push({ Section: "Frequency", Value: seg.frequency });
        exportData.push({ Section: "Training Records", Value: seg.training_records });
        exportData.push({ Section: "Test Records", Value: seg.test_records });
        if (seg.regressors && seg.regressors.length > 0) {
          exportData.push({ Section: "Regressors", Value: seg.regressors.map(r => r.name).join(", ") });
        }
        exportData.push({});
      });

      // Add detailed results for each segment
      results.segments.forEach((segment) => {
        exportData.push({ Section: `RESULTS FOR ${segment.segment}` });
        
        // Add metrics
        if (segment.metrics) {
          exportData.push({ Section: "Performance Metrics" });
          Object.entries(segment.metrics).forEach(([key, value]) => {
            exportData.push({ Section: key.toUpperCase(), Value: value });
          });
          exportData.push({});
        }

        // Add AI commentary
        if (segment.ai_commentary) {
          exportData.push({ Section: "AI Analysis", Value: segment.ai_commentary });
          exportData.push({});
        }

        // Add all data points (training, test, forecast)
        exportData.push({ Section: "COMPLETE TIME SERIES DATA" });
        exportData.push({
          Date: "Date",
          Actual: "Actual",
          Predicted: "Predicted",
          Lower_Bound: "Lower Bound",
          Upper_Bound: "Upper Bound",
          Data_Type: "Data Type"
        });

        // Training data
        segment.training_data.forEach((point) => {
          exportData.push({
            Date: point.date,
            Actual: point.actual,
            Predicted: point.predicted,
            Lower_Bound: point.lower_bound,
            Upper_Bound: point.upper_bound,
            Data_Type: "Training"
          });
        });

        // Test data
        segment.test_data.forEach((point) => {
          exportData.push({
            Date: point.date,
            Actual: point.actual,
            Predicted: point.predicted,
            Lower_Bound: point.lower_bound,
            Upper_Bound: point.upper_bound,
            Data_Type: "Test"
          });
        });

        // Forecast data
        segment.forecast_data.forEach((point) => {
          exportData.push({
            Date: point.date,
            Actual: point.actual || "",
            Predicted: point.predicted,
            Lower_Bound: point.lower_bound,
            Upper_Bound: point.upper_bound,
            Data_Type: "Forecast"
          });
        });

        exportData.push({});
        exportData.push({});
      });

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `detailed_forecast_report_${modelName || 'model'}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save to database
      await saveReportToDatabase({
        config,
        results,
        timestamp,
        exportType: "detailed_csv"
      }, `Detailed Report - ${modelName || 'Unnamed'} - ${timestamp}`, "detailed_csv");

      toast.success("Detailed report exported with configuration");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  const exportSummaryCSV = async () => {
    try {
      const exportData: any[] = [];
      const timestamp = new Date().toISOString();

      // Add header
      exportData.push({
        Model: modelName || "Unsaved Model",
        Generated: timestamp,
        Model_Type: config.model,
        Segment: "Segment",
        MAE: "MAE",
        RMSE: "RMSE",
        MAPE: "MAPE",
        R2: "R²",
      });

      // Add segment metrics
      results.segments.forEach((segment) => {
        if (segment.metrics) {
          exportData.push({
            Model: modelName || "Unsaved Model",
            Generated: timestamp,
            Model_Type: config.model,
            Segment: segment.segment,
            MAE: segment.metrics.mae?.toFixed(4) || "N/A",
            RMSE: segment.metrics.rmse?.toFixed(4) || "N/A",
            MAPE: segment.metrics.mape?.toFixed(2) || "N/A",
            R2: segment.metrics.r2?.toFixed(4) || "N/A",
          });
        }
      });

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `summary_report_${modelName || 'model'}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save to database
      await saveReportToDatabase({
        config,
        results,
        timestamp,
        exportType: "summary_csv"
      }, `Summary Report - ${modelName || 'Unnamed'} - ${timestamp}`, "summary_csv");

      toast.success("Summary report exported");
    } catch (error) {
      console.error("Error exporting summary:", error);
      toast.error("Failed to export summary");
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={exportDetailedCSV} variant="outline" size="sm">
        <FileText className="h-4 w-4 mr-2" />
        Export Detailed Report
      </Button>
      <Button onClick={exportSummaryCSV} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export Summary
      </Button>
    </div>
  );
}