import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { TrendingUp, Target, Activity, Wand2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResultsTable } from "./ResultsTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { ForecastResults as ForecastResultsType, SegmentForecastResult } from "@/types/forecastResults";
import type { PerformanceMetric } from "@/types/forecast";

interface ForecastResultsProps {
  results: ForecastResultsType;
  selectedMetrics: PerformanceMetric[];
}

const metricLabels: Record<PerformanceMetric, string> = {
  mae: "MAE",
  rmse: "RMSE",
  mape: "MAPE",
  mse: "MSE",
  r2: "R²",
  coverage: "Coverage",
  smape: "SMAPE",
  mase: "MASE",
};

export const ForecastResults = ({ results, selectedMetrics }: ForecastResultsProps) => {
  const { toast } = useToast();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [currentSegmentForExport, setCurrentSegmentForExport] = useState<string>('');
  const [exportType, setExportType] = useState<'pdf' | 'html'>('pdf');
  
  const completeTimeSeriesRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const testPerformanceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const captureChartAsImage = async (chartElement: HTMLElement | null): Promise<string | null> => {
    if (!chartElement) return null;
    
    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  const generateReportHTML = (
    segment: SegmentForecastResult,
    modelName: string,
    timestamp: string,
    chartImages: { completeTimeSeries?: string; testPerformance?: string }
  ): string => {
    const metricsHTML = selectedMetrics
      .filter(metric => segment.metrics?.[metric] !== undefined)
      .map(metric => {
        const value = segment.metrics?.[metric];
        const benchmarkValue = segment.benchmark_metrics?.[metric];
        const isPercentage = ['mape', 'coverage', 'smape', 'r2'].includes(metric);
        
        return `
          <div style="margin-bottom: 15px;">
            <div style="color: #666; font-size: 12px; margin-bottom: 5px;">${metricLabels[metric]}</div>
            <div style="font-size: 24px; font-weight: bold; color: #333;">
              ${value?.toFixed(metric === 'r2' ? 3 : isPercentage ? 1 : 2)}${isPercentage && metric !== 'r2' ? '%' : ''}
              ${benchmarkValue !== undefined ? `
                <span style="font-size: 14px; color: #666; font-weight: normal;">
                  vs ${benchmarkValue.toFixed(metric === 'r2' ? 3 : isPercentage ? 1 : 2)}${isPercentage && metric !== 'r2' ? '%' : ''}
                </span>
              ` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Forecast Report - ${segment.segment}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px 20px;
              background: #f9fafb;
            }
            .header {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-bottom: 30px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .segment-title {
              font-size: 32px;
              font-weight: bold;
              color: #111;
              margin-bottom: 10px;
            }
            .metadata {
              color: #666;
              font-size: 14px;
            }
            .section {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-bottom: 30px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #111;
              margin-bottom: 20px;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
            }
            .chart-container {
              margin: 20px 0;
            }
            .chart-container img {
              width: 100%;
              height: auto;
              border-radius: 4px;
            }
            .ai-commentary {
              background: #f0f9ff;
              border-left: 4px solid #0ea5e9;
              padding: 20px;
              margin-top: 20px;
              border-radius: 4px;
            }
            .commentary-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #0369a1;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="segment-title">${segment.segment}</div>
            <div class="metadata">
              Model: ${segment.model || modelName} | Generated: ${new Date(timestamp).toLocaleString()}
              ${segment.benchmark_model ? ` | Benchmark: ${segment.benchmark_model}` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Performance Metrics</div>
            <div class="metrics-grid">
              ${metricsHTML}
            </div>
            ${segment.ai_commentary ? `
              <div class="ai-commentary">
                <div class="commentary-title">AI Analysis</div>
                <div style="white-space: pre-line;">${segment.ai_commentary}</div>
              </div>
            ` : ''}
          </div>

          ${chartImages.completeTimeSeries ? `
            <div class="section">
              <div class="section-title">Complete Time Series</div>
              <div class="chart-container">
                <img src="${chartImages.completeTimeSeries}" alt="Complete Time Series Chart" />
              </div>
            </div>
          ` : ''}

          ${chartImages.testPerformance && segment.test_data.length > 0 ? `
            <div class="section">
              <div class="section-title">Test Set Performance</div>
              <div class="chart-container">
                <img src="${chartImages.testPerformance}" alt="Test Set Performance Chart" />
              </div>
            </div>
          ` : ''}
        </body>
      </html>
    `;
  };

  const generatePDF = async (
    segment: SegmentForecastResult,
    modelName: string,
    timestamp: string,
    chartImages: { completeTimeSeries?: string; testPerformance?: string }
  ): Promise<Blob> => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Header - Segment Name
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(segment.segment, margin, yPos);
    yPos += 10;

    // Metadata
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);
    const metadataText = `Model: ${segment.model || modelName} | Generated: ${new Date(timestamp).toLocaleString()}`;
    pdf.text(metadataText, margin, yPos);
    yPos += 15;

    if (segment.benchmark_model) {
      pdf.text(`Benchmark: ${segment.benchmark_model}`, margin, yPos);
      yPos += 15;
    }

    // Performance Metrics
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0);
    pdf.text('Performance Metrics', margin, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    selectedMetrics.forEach(metric => {
      const value = segment.metrics?.[metric];
      const benchmarkValue = segment.benchmark_metrics?.[metric];
      if (value === undefined) return;

      const isPercentage = ['mape', 'coverage', 'smape', 'r2'].includes(metric);
      const displayValue = `${value.toFixed(metric === 'r2' ? 3 : isPercentage ? 1 : 2)}${isPercentage && metric !== 'r2' ? '%' : ''}`;
      const benchmarkText = benchmarkValue !== undefined 
        ? ` vs ${benchmarkValue.toFixed(metric === 'r2' ? 3 : isPercentage ? 1 : 2)}${isPercentage && metric !== 'r2' ? '%' : ''}`
        : '';

      pdf.setTextColor(100);
      pdf.text(metricLabels[metric], margin, yPos);
      pdf.setTextColor(0);
      pdf.setFont('helvetica', 'bold');
      pdf.text(displayValue + benchmarkText, margin + 30, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 7;
    });

    yPos += 5;

    // AI Commentary
    if (segment.ai_commentary) {
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0);
      pdf.text('AI Analysis', margin, yPos);
      yPos += 7;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const commentaryLines = pdf.splitTextToSize(segment.ai_commentary, pageWidth - (2 * margin));
      pdf.text(commentaryLines, margin, yPos);
      yPos += commentaryLines.length * 5 + 10;
    }

    // Complete Time Series Chart
    if (chartImages.completeTimeSeries) {
      if (yPos > pageHeight - 120) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Complete Time Series', margin, yPos);
      yPos += 10;

      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = 100;
      pdf.addImage(chartImages.completeTimeSeries, 'PNG', margin, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 15;
    }

    // Test Performance Chart
    if (chartImages.testPerformance && segment.test_data.length > 0) {
      if (yPos > pageHeight - 120) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Test Set Performance', margin, yPos);
      yPos += 10;

      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = 80;
      pdf.addImage(chartImages.testPerformance, 'PNG', margin, yPos, imgWidth, imgHeight);
    }

    return pdf.output('blob');
  };

  const handleExportClick = (segmentName: string, type: 'pdf' | 'html') => {
    setCurrentSegmentForExport(segmentName);
    setExportType(type);
    setReportName(`${segmentName}_${type}_report`);
    setExportDialogOpen(true);
  };

  const saveReportToDatabase = async (reportName: string, reportType: string, blob: Blob) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save reports",
          variant: "destructive",
        });
        return;
      }

      const fileExt = reportType === 'pdf' ? 'pdf' : 'html';
      const fileName = `${reportName}.${fileExt}`;
      const filePath = `${user.id}/${Date.now()}_${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(filePath, blob, {
          contentType: reportType === 'pdf' ? 'application/pdf' : 'text/html',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      toast({
        title: "Report saved",
        description: `${reportName}.${fileExt} has been saved successfully`,
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error saving report",
        description: "Failed to save report to database",
        variant: "destructive",
      });
    }
  };

  const handleExportConfirm = async () => {
    const segment = results.segments.find(s => s.segment === currentSegmentForExport);
    if (!segment) return;

    try {
      toast({
        title: "Generating report",
        description: "Please wait while we generate your report...",
      });

      const completeTimeSeriesImg = await captureChartAsImage(
        completeTimeSeriesRefs.current[currentSegmentForExport]
      );
      const testPerformanceImg = segment.test_data.length > 0 
        ? await captureChartAsImage(testPerformanceRefs.current[currentSegmentForExport])
        : null;

      const chartImages = {
        completeTimeSeries: completeTimeSeriesImg || undefined,
        testPerformance: testPerformanceImg || undefined,
      };

      if (exportType === 'pdf') {
        const pdfBlob = await generatePDF(
          segment,
          results.model,
          results.timestamp,
          chartImages
        );

        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        await saveReportToDatabase(reportName, 'pdf', pdfBlob);
      } else {
        const htmlContent = generateReportHTML(
          segment,
          results.model,
          results.timestamp,
          chartImages
        );

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        await saveReportToDatabase(reportName, 'html', blob);
      }

      toast({
        title: "Export complete",
        description: `Report exported as ${reportName}.${exportType}`,
      });

      setExportDialogOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the report",
        variant: "destructive",
      });
    }
  };

  const handleCSVExport = (segment: typeof results.segments[0], type: 'detailed' | 'summary') => {
    try {
      let csvContent = '';

      if (type === 'detailed') {
        const allData = [
          ...segment.training_data.map(d => ({ ...d, dataset: 'Training' })),
          ...segment.test_data.map(d => ({ ...d, dataset: 'Test' })),
          ...segment.forecast_data.map(d => ({ ...d, dataset: 'Forecast' })),
        ];

        const csvData = allData.map(point => ({
          Date: point.date,
          Dataset: point.dataset,
          Actual: point.actual ?? '',
          Predicted: point.predicted,
          'Lower Bound': point.lower_bound,
          'Upper Bound': point.upper_bound,
          Model: results.model,
        }));

        csvContent = Papa.unparse(csvData);
      } else {
        const csvData = selectedMetrics
          .filter(metric => segment.metrics?.[metric] !== undefined)
          .map(metric => ({
            Metric: metricLabels[metric],
            Value: segment.metrics?.[metric],
            'Benchmark Value': segment.benchmark_metrics?.[metric] ?? '',
          }));

        csvContent = Papa.unparse(csvData);
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${segment.segment}_${type}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "CSV exported",
        description: `${segment.segment}_${type}.csv downloaded successfully`,
      });
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting CSV",
        variant: "destructive",
      });
    }
  };

  if (!results || results.segments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            No forecast results available. Run a forecast to see results.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Forecast Results
            </CardTitle>
            <CardDescription>
              Model: {results.model} | Generated: {new Date(results.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue={results.segments[0]?.segment || "0"} className="space-y-4">
          <TabsList className="w-full overflow-x-auto flex-wrap h-auto">
            {results.segments.map((segment, idx) => (
              <TabsTrigger key={idx} value={segment.segment} className="flex-1 min-w-[120px]">
                {segment.segment}
              </TabsTrigger>
            ))}
          </TabsList>

          {results.segments.map((segment, idx) => (
            <TabsContent key={idx} value={segment.segment} className="space-y-6">
              {/* Export Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-2 flex-wrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="default">
                          <Download className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExportClick(segment.segment, 'pdf')}>
                          Export as PDF (with graphs)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportClick(segment.segment, 'html')}>
                          Export as HTML (with graphs)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCSVExport(segment, 'detailed')}>
                          Export Detailed CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCSVExport(segment, 'summary')}>
                          Export Summary CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Card - Primary Model */}
              {segment.metrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Model Performance: {segment.model || results.model}
                    </CardTitle>
                    {segment.benchmark_model && (
                      <CardDescription>
                        Comparing with AI-recommended benchmark: {segment.benchmark_model}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedMetrics.map((metric) => {
                        const value = segment.metrics?.[metric];
                        const benchmarkValue = segment.benchmark_metrics?.[metric];
                        if (value === undefined) return null;
                        
                        const isPercentage = ['mape', 'coverage', 'smape', 'r2'].includes(metric);
                        const isBetter = benchmarkValue !== undefined && (
                          ['mae', 'rmse', 'mse', 'mape', 'smape', 'mase'].includes(metric) 
                            ? value < benchmarkValue 
                            : value > benchmarkValue
                        );
                        
                        return (
                          <div key={metric} className="space-y-1">
                            <p className="text-xs text-muted-foreground">{metricLabels[metric]}</p>
                            <div className="flex items-baseline gap-2">
                              <p className={`text-2xl font-bold ${isBetter ? 'text-green-600' : ''}`}>
                                {value.toFixed(metric === 'r2' ? 3 : isPercentage ? 1 : 2)}
                                {isPercentage && metric !== 'r2' ? '%' : ''}
                              </p>
                              {benchmarkValue !== undefined && (
                                <p className="text-sm text-muted-foreground">
                                  vs {benchmarkValue.toFixed(metric === 'r2' ? 3 : isPercentage ? 1 : 2)}
                                  {isPercentage && metric !== 'r2' ? '%' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {segment.ai_commentary && (
                      <Alert className="bg-primary/5 border-primary/20">
                        <Wand2 className="h-4 w-4" />
                        <AlertDescription>
                          <p className="font-semibold text-sm mb-2">AI Analysis</p>
                          <p className="text-sm whitespace-pre-line">{segment.ai_commentary}</p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Combined Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Complete Time Series
                  </CardTitle>
                  <CardDescription>
                    Training data, test predictions, and future forecast with confidence intervals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div ref={(el) => (completeTimeSeriesRefs.current[segment.segment] = el)}>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
                      <div className="w-3 h-3 rounded-full bg-blue-600 mr-2" />
                      Actual Data
                    </Badge>
                    <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30">
                      <div className="w-3 h-3 rounded-full bg-orange-600 mr-2" />
                      Fitted (Test)
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                      <div className="w-3 h-3 rounded-full bg-purple-600 mr-2" />
                      Forecast
                    </Badge>
                    {(segment.benchmark_test_data || segment.benchmark_forecast_data) && (
                      <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30">
                        <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2" />
                        {segment.benchmark_model || 'Benchmark'}
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30">
                      <div className="w-3 h-3 bg-emerald-600/40 mr-2" />
                      95% Confidence
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={(() => {
                      // Prepare data with explicit fields for each line type
                      const allData = [...segment.training_data, ...segment.test_data, ...segment.forecast_data];
                      return allData.map((point, idx) => {
                        const testStartIdx = segment.training_data.length;
                        const testEndIdx = testStartIdx + segment.test_data.length;
                        const forecastStartIdx = testEndIdx;
                        
                        // Determine which fields to populate based on data type
                        let fitted = null;
                        let forecast = null;
                        let benchmark_predicted = null;
                        
                        if (idx >= testStartIdx && idx < testEndIdx) {
                          // This is test data - show fitted line
                          fitted = point.predicted;
                          if (segment.benchmark_test_data) {
                            benchmark_predicted = segment.benchmark_test_data[idx - testStartIdx]?.predicted;
                          }
                        } else if (idx >= forecastStartIdx) {
                          // This is forecast data - show forecast line
                          forecast = point.predicted;
                          if (segment.benchmark_forecast_data) {
                            benchmark_predicted = segment.benchmark_forecast_data[idx - forecastStartIdx]?.predicted;
                          }
                        }
                        
                        return { 
                          ...point, 
                          fitted,
                          forecast,
                          benchmark_predicted 
                        };
                      });
                    })()}>
                      <defs>
                        <linearGradient id={`confidenceGradient-${segment.segment}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(16, 185, 129)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="rgb(16, 185, 129)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs"
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: any) => [typeof value === 'number' ? value.toFixed(2) : value, '']}
                      />
                      <Legend />
                      
                      {/* Confidence interval area */}
                      <Area
                        type="monotone"
                        dataKey="upper_bound"
                        stroke="rgb(16, 185, 129)"
                        strokeWidth={1}
                        strokeOpacity={0.3}
                        fill={`url(#confidenceGradient-${segment.segment})`}
                        name="Upper Bound (95%)"
                      />
                      <Area
                        type="monotone"
                        dataKey="lower_bound"
                        stroke="rgb(16, 185, 129)"
                        strokeWidth={1}
                        strokeOpacity={0.3}
                        fill={`url(#confidenceGradient-${segment.segment})`}
                        name="Lower Bound (95%)"
                      />
                      
                      {/* Actual values (training + test) */}
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="rgb(37, 99, 235)"
                        strokeWidth={2.5}
                        dot={false}
                        name="Actual Data"
                        connectNulls={true}
                      />
                      
                      {/* Test predictions (fitted) */}
                      <Line
                        type="monotone"
                        dataKey="fitted"
                        stroke="rgb(249, 115, 22)"
                        strokeWidth={2.5}
                        strokeDasharray="5 5"
                        dot={{ fill: 'rgb(249, 115, 22)', r: 3 }}
                        name="Fitted (Test)"
                        connectNulls={true}
                      />
                      
                      {/* Forecast */}
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="rgb(147, 51, 234)"
                        strokeWidth={2.5}
                        strokeDasharray="8 4"
                        dot={{ fill: 'rgb(147, 51, 234)', r: 3 }}
                        name="Forecast"
                        connectNulls={true}
                      />
                      
                      {/* Benchmark Model predictions (if available) */}
                      {(segment.benchmark_test_data || segment.benchmark_forecast_data) && (
                        <Line
                          type="monotone"
                          dataKey="benchmark_predicted"
                          stroke="rgb(99, 102, 241)"
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          dot={false}
                          name={`${segment.benchmark_model || 'Benchmark'}`}
                          connectNulls={true}
                        />
                      )}
                      
                      {/* Reference lines */}
                      {segment.test_data.length > 0 && (
                        <ReferenceLine 
                          x={segment.test_data[0]?.date} 
                          stroke="rgb(156, 163, 175)" 
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          label={{ 
                            value: 'Test Start', 
                            position: 'top',
                            fill: 'rgb(75, 85, 99)',
                            fontSize: 12,
                            fontWeight: 600
                          }}
                        />
                      )}
                      {segment.forecast_data.length > 0 && (
                        <ReferenceLine 
                          x={segment.forecast_data[0]?.date} 
                          stroke="rgb(156, 163, 175)" 
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          label={{ 
                            value: 'Forecast Start', 
                            position: 'top',
                            fill: 'rgb(75, 85, 99)',
                            fontSize: 12,
                            fontWeight: 600
                          }}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Test Performance Detail */}
              {segment.test_data.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Test Set Performance</CardTitle>
                    <CardDescription>
                      Model predictions vs actual values on holdout test data
                      {segment.benchmark_model && ` (includes ${segment.benchmark_model} benchmark)`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div ref={(el) => (testPerformanceRefs.current[segment.segment] = el)}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={segment.benchmark_test_data ? 
                        segment.test_data.map((d, i) => ({
                          ...d,
                          benchmark_predicted: segment.benchmark_test_data?.[i]?.predicted
                        })) : 
                        segment.test_data
                      }>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs"
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value: any) => [typeof value === 'number' ? value.toFixed(2) : value, '']}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="rgb(37, 99, 235)"
                          strokeWidth={2.5}
                          name="Actual"
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="rgb(249, 115, 22)"
                          strokeWidth={2.5}
                          strokeDasharray="5 5"
                          name={`${segment.model || results.model}`}
                        />
                        {segment.benchmark_test_data && (
                          <Line
                            type="monotone"
                            dataKey="benchmark_predicted"
                            stroke="rgb(99, 102, 241)"
                            strokeWidth={2.5}
                            strokeDasharray="3 3"
                            name={`${segment.benchmark_model} (Benchmark)`}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Table */}
              <ResultsTable
                segment={segment.segment}
                trainingData={segment.training_data}
                testData={segment.test_data}
                forecastData={segment.forecast_data}
                primaryModel={segment.model || results.model}
                benchmarkModel={segment.benchmark_model}
                benchmarkTrainingData={segment.benchmark_training_data}
                benchmarkTestData={segment.benchmark_test_data}
                benchmarkForecastData={segment.benchmark_forecast_data}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>
              Enter a name for your {exportType.toUpperCase()} report. The report will include graphs and analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder={`${currentSegmentForExport}_${exportType}_report`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportConfirm} disabled={!reportName.trim()}>
              Export {exportType.toUpperCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
