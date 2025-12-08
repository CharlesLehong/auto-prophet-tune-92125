import React, { useState, useCallback } from "react";
import { LogOut, TrendingUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import DataUpload from "@/components/forecast/DataUpload";
import ModelSelector from "@/components/forecast/ModelSelector";
import VariableConfig from "@/components/forecast/VariableConfig";
import SegmentMapper from "@/components/forecast/SegmentMapper";
import DataAnalysis from "@/components/forecast/DataAnalysis";
import RegressorConfig, { type RegressorSettings } from "@/components/forecast/RegressorConfig";
import ProphetHyperparameters from "@/components/forecast/ProphetHyperparameters";
import MetricsSelector from "@/components/forecast/MetricsSelector";
import ForecastResults from "@/components/forecast/ForecastResults";
import ForecastProgress from "@/components/forecast/ForecastProgress";
import type { ForecastModel, SegmentConfig, ProphetParameters, PerformanceMetric } from "@/types/forecast";
import type { ForecastResults as ForecastResultsType } from "@/types/forecastResults";
import type { TransformationRecommendation } from "@/types/dataAnalysis";
import { defaultProphetParams } from "@/types/forecast";

// Metric calculation helper functions
const calculateMetrics = (
  actuals: number[],
  predictions: number[],
  lowerBounds: number[],
  upperBounds: number[],
  metric: PerformanceMetric
): number => {
  const n = actuals.length;
  if (n === 0 || predictions.length !== n) return 0;

  // Filter out any NaN values
  const validPairs = actuals.map((a, i) => ({ a, p: predictions[i], lb: lowerBounds[i], ub: upperBounds[i] }))
    .filter(pair => !isNaN(pair.a) && !isNaN(pair.p) && pair.a !== null && pair.p !== null);

  const validN = validPairs.length;
  if (validN === 0) return 0;

  const validActuals = validPairs.map(p => p.a);
  const validPredictions = validPairs.map(p => p.p);
  const validLower = validPairs.map(p => p.lb);
  const validUpper = validPairs.map(p => p.ub);

  switch (metric) {
    case "mae": {
      // Mean Absolute Error
      const sum = validActuals.reduce((acc, a, i) => acc + Math.abs(a - validPredictions[i]), 0);
      return sum / validN;
    }
    case "mse": {
      // Mean Squared Error
      const sum = validActuals.reduce((acc, a, i) => acc + Math.pow(a - validPredictions[i], 2), 0);
      return sum / validN;
    }
    case "rmse": {
      // Root Mean Squared Error
      const sum = validActuals.reduce((acc, a, i) => acc + Math.pow(a - validPredictions[i], 2), 0);
      return Math.sqrt(sum / validN);
    }
    case "mape": {
      // Mean Absolute Percentage Error (returns as percentage, e.g., 5.2 means 5.2%)
      const validForMape = validPairs.filter(p => Math.abs(p.a) > 0.0001);
      if (validForMape.length === 0) return 0;
      const sum = validForMape.reduce((acc, p) => acc + Math.abs((p.a - p.p) / p.a), 0);
      return (sum / validForMape.length) * 100;
    }
    case "smape": {
      // Symmetric MAPE (returns as percentage)
      const validForSmape = validPairs.filter(p => (Math.abs(p.a) + Math.abs(p.p)) > 0.0001);
      if (validForSmape.length === 0) return 0;
      const sum = validForSmape.reduce((acc, p) => {
        const denom = (Math.abs(p.a) + Math.abs(p.p)) / 2;
        return acc + Math.abs(p.a - p.p) / denom;
      }, 0);
      return (sum / validForSmape.length) * 100;
    }
    case "r_squared": {
      // R-Squared (Coefficient of Determination)
      const meanActual = validActuals.reduce((a, b) => a + b, 0) / validN;
      const ssTot = validActuals.reduce((acc, a) => acc + Math.pow(a - meanActual, 2), 0);
      const ssRes = validActuals.reduce((acc, a, i) => acc + Math.pow(a - validPredictions[i], 2), 0);
      if (ssTot === 0) return 1; // Perfect prediction of constant
      return 1 - (ssRes / ssTot);
    }
    case "adjusted_r_squared": {
      // Adjusted R-Squared
      const meanActual = validActuals.reduce((a, b) => a + b, 0) / validN;
      const ssTot = validActuals.reduce((acc, a) => acc + Math.pow(a - meanActual, 2), 0);
      const ssRes = validActuals.reduce((acc, a, i) => acc + Math.pow(a - validPredictions[i], 2), 0);
      if (ssTot === 0) return 1;
      const rSquared = 1 - (ssRes / ssTot);
      const k = 1; // Number of predictors (simplified)
      if (validN <= k + 1) return rSquared;
      return 1 - ((1 - rSquared) * (validN - 1)) / (validN - k - 1);
    }
    case "mase": {
      // Mean Absolute Scaled Error
      const mae = validActuals.reduce((acc, a, i) => acc + Math.abs(a - validPredictions[i]), 0) / validN;
      // Calculate naive forecast error (random walk)
      let naiveSum = 0;
      for (let i = 1; i < validN; i++) {
        naiveSum += Math.abs(validActuals[i] - validActuals[i - 1]);
      }
      const naiveMae = naiveSum / (validN - 1);
      if (naiveMae === 0) return 0;
      return mae / naiveMae;
    }
    case "coverage": {
      // Coverage: proportion of actuals within prediction interval (returns as decimal 0-1)
      const withinInterval = validPairs.filter(
        (p, i) => p.a >= validLower[i] && p.a <= validUpper[i]
      ).length;
      return withinInterval / validN;
    }
    default:
      return 0;
  }
};

type WorkflowStep =
  | "upload"
  | "model"
  | "variables"
  | "segments"
  | "analysis"
  | "regressors"
  | "metrics"
  | "parameters"
  | "results";

const workflowSteps: { id: WorkflowStep; label: string; shortLabel: string }[] = [
  { id: "upload", label: "Upload Data", shortLabel: "Upload" },
  { id: "model", label: "Select Model", shortLabel: "Model" },
  { id: "variables", label: "Configure Variables", shortLabel: "Variables" },
  { id: "segments", label: "Segment Mapping", shortLabel: "Segments" },
  { id: "analysis", label: "Data Analysis", shortLabel: "Analysis" },
  { id: "regressors", label: "Regressors", shortLabel: "Regressors" },
  { id: "metrics", label: "Metrics", shortLabel: "Metrics" },
  { id: "parameters", label: "Parameters", shortLabel: "Params" },
  { id: "results", label: "Results", shortLabel: "Results" },
];

const Index: React.FC = () => {
  // Data state
  const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");

  // Configuration state
  const [selectedModel, setSelectedModel] = useState<ForecastModel>("prophet");
  const [dateColumn, setDateColumn] = useState<string>("");
  const [segmentColumn, setSegmentColumn] = useState<string>("");
  const [dependentVariable, setDependentVariable] = useState<string>("");
  const [segments, setSegments] = useState<SegmentConfig[]>([]);
  const [prophetParams, setProphetParams] = useState<ProphetParameters>(defaultProphetParams);
  const [selectedMetrics, setSelectedMetrics] = useState<PerformanceMetric[]>([
    "mae",
    "rmse",
    "mape",
    "r_squared",
  ]);
  const [selectedRegressors, setSelectedRegressors] = useState<RegressorSettings[]>([]);
  const [selectedTransformations, setSelectedTransformations] = useState<TransformationRecommendation[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<WorkflowStep>("upload");
  const [isRunning, setIsRunning] = useState(false);
  const [forecastResults, setForecastResults] = useState<ForecastResultsType | null>(null);

  // Data loading handler
  const handleDataLoaded = useCallback(
    (data: Record<string, unknown>[], cols: string[]) => {
      setCsvData(data);
      setColumns(cols);
      setFileName(`data_${Date.now()}.csv`);

      // Auto-detect date column
      const likelyDateCol = cols.find((col) => {
        const lower = col.toLowerCase();
        return lower.includes("date") || lower.includes("time");
      });
      if (likelyDateCol) setDateColumn(likelyDateCol);
    },
    []
  );

  const handleClearData = useCallback(() => {
    setCsvData([]);
    setColumns([]);
    setFileName("");
    setDateColumn("");
    setSegmentColumn("");
    setDependentVariable("");
    setSegments([]);
    setSelectedRegressors([]);
    setSelectedTransformations([]);
    setForecastResults(null);
  }, []);

  // Navigation helpers
  const canProceed = (step: WorkflowStep): boolean => {
    switch (step) {
      case "upload":
        return csvData.length > 0;
      case "model":
        return !!selectedModel;
      case "variables":
        return !!dateColumn && !!dependentVariable;
      case "segments":
        return segments.length > 0;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    const currentIndex = workflowSteps.findIndex((s) => s.id === activeTab);
    if (currentIndex < workflowSteps.length - 1) {
      setActiveTab(workflowSteps[currentIndex + 1].id);
    }
  };

  // Helper to get date increment based on frequency
  const getDateIncrement = (frequency: string): { unit: 'days' | 'months' | 'years', amount: number } => {
    switch (frequency) {
      case 'D': return { unit: 'days', amount: 1 };
      case 'W': return { unit: 'days', amount: 7 };
      case 'MS': return { unit: 'months', amount: 1 };
      case 'QS': return { unit: 'months', amount: 3 };
      case 'YS': return { unit: 'years', amount: 1 };
      default: return { unit: 'months', amount: 1 };
    }
  };

  // Run forecast (mock implementation)
  const runForecast = async () => {
    setIsRunning(true);
    setActiveTab("results");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock results using actual data dates where possible
    const mockResults: ForecastResultsType = {
      timestamp: new Date().toISOString(),
      modelType: selectedModel,
      segmentResults: segments.map((segment) => {
        // Get segment data
        let segmentData = csvData;
        if (segmentColumn && segment.segmentName !== "All Data") {
          segmentData = csvData.filter(
            (row) => String(row[segmentColumn]) === segment.segmentName
          );
        }

        // Use actual dates from data
        const actualDates = segmentData
          .map((row) => String(row[dateColumn]))
          .filter((d) => d && d !== "undefined");

        const actualValues = segmentData
          .map((row) => Number(row[dependentVariable]))
          .filter((v) => !isNaN(v));

        const dataLength = Math.min(actualDates.length, actualValues.length);
        const trainEndIdx = Math.floor(dataLength * 0.8);
        const testEndIdx = dataLength;

        // Generate forecast dates based on frequency
        const { unit, amount } = getDateIncrement(segment.frequency);
        const lastDate = actualDates.length > 0 ? new Date(actualDates[actualDates.length - 1]) : new Date();
        const forecastDates: string[] = [];
        for (let i = 1; i <= 10; i++) {
          const forecastDate = new Date(lastDate);
          if (unit === 'days') {
            forecastDate.setDate(forecastDate.getDate() + amount * i);
          } else if (unit === 'months') {
            forecastDate.setMonth(forecastDate.getMonth() + amount * i);
          } else {
            forecastDate.setFullYear(forecastDate.getFullYear() + amount * i);
          }
          forecastDates.push(forecastDate.toISOString());
        }

        // Build forecast data from actual data + forecast extension
        const forecastData = [
          // Historical data
          ...actualDates.slice(0, dataLength).map((date, i) => {
            const value = actualValues[i] || 0;
            // Add small noise for demo predictions (in real app, this would be model output)
            const noise = (Math.random() - 0.5) * value * 0.1;
            const predicted = value + noise;
            // Confidence interval based on prediction uncertainty
            const uncertainty = Math.abs(value) * 0.15;
            return {
              date: date,
              actual: value,
              predicted: predicted,
              lowerBound: predicted - uncertainty,
              upperBound: predicted + uncertainty,
              isForecast: false,
              isTestSet: i >= trainEndIdx,
            };
          }),
          // Future forecast
          ...forecastDates.map((date, i) => {
            const lastValue = actualValues[actualValues.length - 1] || 100;
            const trend = lastValue * (1 + 0.02 * (i + 1));
            const uncertainty = Math.abs(trend) * 0.15 * (1 + i * 0.1); // Increasing uncertainty
            return {
              date: date,
              actual: null,
              predicted: trend,
              lowerBound: trend - uncertainty,
              upperBound: trend + uncertainty,
              isForecast: true,
              isTestSet: false,
            };
          }),
        ];

        // Extract training and test data for metric calculations
        const trainData = forecastData.filter(d => !d.isForecast && !d.isTestSet);
        const testData = forecastData.filter(d => !d.isForecast && d.isTestSet);

        const trainActuals = trainData.map(d => d.actual).filter((a): a is number => a !== null);
        const trainPredictions = trainData.map(d => d.predicted).filter((p): p is number => p !== null);
        const trainLower = trainData.map(d => d.lowerBound).filter((l): l is number => l !== null);
        const trainUpper = trainData.map(d => d.upperBound).filter((u): u is number => u !== null);

        const testActuals = testData.map(d => d.actual).filter((a): a is number => a !== null);
        const testPredictions = testData.map(d => d.predicted).filter((p): p is number => p !== null);
        const testLower = testData.map(d => d.lowerBound).filter((l): l is number => l !== null);
        const testUpper = testData.map(d => d.upperBound).filter((u): u is number => u !== null);

        return {
          segmentName: segment.segmentName,
          frequency: segment.frequency,
          forecastData,
          metrics: selectedMetrics.map((metric) => ({
            metric,
            trainValue: calculateMetrics(trainActuals, trainPredictions, trainLower, trainUpper, metric),
            testValue: calculateMetrics(testActuals, testPredictions, testLower, testUpper, metric),
          })),
          transformationsApplied: selectedTransformations.map((t) => t.type),
          modelConfig: { model: selectedModel },
          trainStartDate: actualDates[0] || new Date().toISOString(),
          trainEndDate: actualDates[trainEndIdx - 1] || new Date().toISOString(),
          testStartDate: actualDates[trainEndIdx] || new Date().toISOString(),
          testEndDate: actualDates[testEndIdx - 1] || new Date().toISOString(),
          forecastStartDate: forecastDates[0] || new Date().toISOString(),
          forecastEndDate: forecastDates[forecastDates.length - 1] || new Date().toISOString(),
          aiCommentary:
            "The model shows good fit to the training data with minimal overfitting. Seasonality patterns are well captured.",
        };
      }),
    };

    setForecastResults(mockResults);
    setIsRunning(false);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">Prophet-Tune</h1>
                  <p className="text-sm text-muted-foreground">
                    Time Series Forecasting Platform
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as WorkflowStep)}>
            {/* Step Navigation */}
            <div className="mb-6 overflow-x-auto">
              <TabsList className="inline-flex h-auto p-1 gap-1">
                {workflowSteps.map((step, index) => {
                  const isPast = workflowSteps.findIndex((s) => s.id === activeTab) > index;
                  const isCurrent = step.id === activeTab;

                  return (
                    <TabsTrigger
                      key={step.id}
                      value={step.id}
                      disabled={index > 0 && !canProceed(workflowSteps[index - 1].id)}
                      className="relative px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <Badge
                          variant={isCurrent ? "default" : isPast ? "secondary" : "outline"}
                          className="h-5 w-5 p-0 justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <span className="hidden sm:inline">{step.shortLabel}</span>
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Upload */}
              <TabsContent value="upload" className="mt-0">
                <DataUpload
                  onDataLoaded={handleDataLoaded}
                  isLoaded={csvData.length > 0}
                  fileName={fileName}
                  onClear={handleClearData}
                />
                {csvData.length > 0 && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={goToNextStep}>
                      Continue to Model Selection
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Step 2: Model Selection */}
              <TabsContent value="model" className="mt-0">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={goToNextStep}>Continue to Variables</Button>
                </div>
              </TabsContent>

              {/* Step 3: Variable Configuration */}
              <TabsContent value="variables" className="mt-0">
                <VariableConfig
                  columns={columns}
                  dateColumn={dateColumn}
                  segmentColumn={segmentColumn}
                  dependentVariable={dependentVariable}
                  onDateColumnChange={setDateColumn}
                  onSegmentColumnChange={setSegmentColumn}
                  onDependentVariableChange={setDependentVariable}
                  data={csvData}
                />
                {dateColumn && dependentVariable && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={goToNextStep}>Continue to Segments</Button>
                  </div>
                )}
              </TabsContent>

              {/* Step 4: Segment Mapping */}
              <TabsContent value="segments" className="mt-0">
                <SegmentMapper
                  data={csvData}
                  dateColumn={dateColumn}
                  segmentColumn={segmentColumn}
                  segments={segments}
                  onSegmentsChange={setSegments}
                />
                {segments.length > 0 && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={goToNextStep}>Continue to Analysis</Button>
                  </div>
                )}
              </TabsContent>

              {/* Step 5: Data Analysis */}
              <TabsContent value="analysis" className="mt-0">
                <DataAnalysis
                  data={csvData}
                  dependentVariable={dependentVariable}
                  dateColumn={dateColumn}
                  segmentColumn={segmentColumn}
                  segments={segments}
                  selectedTransformations={selectedTransformations}
                  onTransformationsChange={setSelectedTransformations}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={goToNextStep}>Continue to Regressors</Button>
                </div>
              </TabsContent>

              {/* Step 6: Regressors */}
              <TabsContent value="regressors" className="mt-0">
                <RegressorConfig
                  columns={columns}
                  dateColumn={dateColumn}
                  segmentColumn={segmentColumn}
                  dependentVariable={dependentVariable}
                  selectedRegressors={selectedRegressors}
                  onRegressorsChange={setSelectedRegressors}
                  data={csvData}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={goToNextStep}>Continue to Metrics</Button>
                </div>
              </TabsContent>

              {/* Step 7: Metrics Selection */}
              <TabsContent value="metrics" className="mt-0">
                <MetricsSelector
                  selectedMetrics={selectedMetrics}
                  onMetricsChange={setSelectedMetrics}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={goToNextStep}>Continue to Parameters</Button>
                </div>
              </TabsContent>

              {/* Step 8: Parameters */}
              <TabsContent value="parameters" className="mt-0">
                {selectedModel === "prophet" && (
                  <ProphetHyperparameters
                    parameters={prophetParams}
                    onParametersChange={setProphetParams}
                  />
                )}
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="default" onClick={runForecast} disabled={isRunning}>
                    <Play className="h-4 w-4 mr-1" />
                    Run Forecast
                  </Button>
                </div>
              </TabsContent>

              {/* Step 9: Results */}
              <TabsContent value="results" className="mt-0">
                {isRunning ? (
                  <ForecastProgress
                    segments={segments.map((s) => ({
                      segmentName: s.segmentName,
                      status: "processing",
                    }))}
                    overallProgress={50}
                    currentStep="Running forecast model..."
                  />
                ) : forecastResults ? (
                  <ForecastResults
                    results={forecastResults}
                    originalData={csvData}
                    dateColumn={dateColumn}
                    segmentColumn={segmentColumn}
                    dependentVariable={dependentVariable}
                    selectedTransformations={selectedTransformations}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No forecast results yet. Complete the configuration and run the forecast.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Index;
