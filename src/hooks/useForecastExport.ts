import { useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import type { ForecastResults } from "@/types/forecastResults";
import type { PerformanceMetric } from "@/types/forecast";

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

export const useForecastExport = (results: ForecastResults, selectedMetrics: PerformanceMetric[]) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [exportType, setExportType] = useState<"pdf" | "html" | "csv">("pdf");

  const handleExportClick = (type: "pdf" | "html" | "csv") => {
    setExportType(type);
    setReportName(`Forecast_Report_${new Date().toISOString().split('T')[0]}`);
    setExportDialogOpen(true);
  };

  const captureChart = async (element: HTMLElement): Promise<string> => {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    return canvas.toDataURL('image/png');
  };

  const generateCSV = () => {
    let csv = "Segment,Date,Actual,Predicted,Lower Bound,Upper Bound,Type\n";
    
    results.segments.forEach(segment => {
      const allData = [
        ...segment.training_data.map(d => ({ ...d, type: 'Training' })),
        ...segment.test_data.map(d => ({ ...d, type: 'Test' })),
        ...segment.forecast_data.map(d => ({ ...d, type: 'Forecast' }))
      ];
      
      allData.forEach(row => {
        csv += `${segment.segment},${row.date},${row.actual || ''},${row.predicted},${row.lower_bound || ''},${row.upper_bound || ''},${row.type}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const generateHTML = async () => {
    try {
      toast.loading("Capturing charts...");
      
      let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${reportName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #fff; }
    h1 { color: #333; border-bottom: 3px solid #4f46e5; padding-bottom: 10px; }
    h2 { color: #4f46e5; margin-top: 30px; }
    .metadata { color: #666; margin-bottom: 30px; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .metric { padding: 15px; background: #f9fafb; border-left: 4px solid #4f46e5; }
    .metric-label { font-size: 12px; color: #666; }
    .metric-value { font-size: 24px; font-weight: bold; color: #333; }
    .chart-container { margin: 30px 0; }
    .chart-container img { max-width: 100%; height: auto; border: 1px solid #e5e7eb; }
    .ai-commentary { background: #eff6ff; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>Forecast Report: ${reportName}</h1>
  <div class="metadata">
    <p><strong>Model:</strong> ${results.model}</p>
    <p><strong>Generated:</strong> ${new Date(results.timestamp).toLocaleString()}</p>
  </div>
`;

      for (const segment of results.segments) {
        html += `<h2>Segment: ${segment.segment}</h2>`;
        
        if (segment.metrics) {
          html += '<div class="metrics">';
          selectedMetrics.forEach(metric => {
            const value = segment.metrics?.[metric];
            if (value !== undefined) {
              const isPercentage = ['mape', 'coverage', 'smape', 'r2'].includes(metric);
              html += `
                <div class="metric">
                  <div class="metric-label">${metricLabels[metric]}</div>
                  <div class="metric-value">${value.toFixed(metric === 'r2' ? 3 : isPercentage ? 1 : 2)}${isPercentage && metric !== 'r2' ? '%' : ''}</div>
                </div>
              `;
            }
          });
          html += '</div>';
        }

        if (segment.ai_commentary) {
          html += `<div class="ai-commentary"><strong>AI Analysis:</strong><br>${segment.ai_commentary.replace(/\n/g, '<br>')}</div>`;
        }

        const chartElements = document.querySelectorAll(`[data-segment="${segment.segment}"] .recharts-wrapper`);
        for (let i = 0; i < chartElements.length; i++) {
          const img = await captureChart(chartElements[i] as HTMLElement);
          html += `<div class="chart-container"><img src="${img}" alt="Chart ${i + 1}"></div>`;
        }
      }

      html += '</body></html>';

      if (exportType === 'html') {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportName}.html`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("HTML report exported!");
      } else {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          setTimeout(() => {
            printWindow.print();
          }, 500);
          toast.success("Opening print dialog...");
        }
      }
    } catch (error) {
      toast.error("Export failed. Please try again.");
      console.error(error);
    }
  };

  const handleExport = async () => {
    setExportDialogOpen(false);
    if (exportType === 'csv') {
      generateCSV();
    } else {
      await generateHTML();
    }
  };

  return {
    exportDialogOpen,
    setExportDialogOpen,
    reportName,
    setReportName,
    exportType,
    handleExportClick,
    handleExport
  };
};
