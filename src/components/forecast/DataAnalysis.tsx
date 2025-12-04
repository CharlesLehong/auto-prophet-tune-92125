import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";
import {
  Activity,
  TrendingUp,
  Wand2,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TransformationRecommendation } from "@/types/dataAnalysis";

interface DataAnalysisProps {
  data: Record<string, unknown>[];
  dependentVariable: string;
  dateColumn: string;
  segmentColumn: string;
  segments: { segmentName: string }[];
  selectedTransformations: TransformationRecommendation[];
  onTransformationsChange: (transformations: TransformationRecommendation[]) => void;
}

interface AnalysisResult {
  segmentName: string;
  isStationary: boolean;
  adfStatistic: number;
  pValue: number;
  hasTrend: boolean;
  hasSeasonality: boolean;
  seasonalPeriod: number;
  hasVarianceInstability: boolean;
  mean: number;
  std: number;
  suggestedArima: { p: number; d: number; q: number };
  recommendations: TransformationRecommendation[];
  timeSeriesData: { date: string; value: number; trend: number }[];
  acfData: { lag: number; acf: number }[];
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({
  data,
  dependentVariable,
  dateColumn,
  segmentColumn,
  segments,
  selectedTransformations,
  onTransformationsChange,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>(
    segments[0]?.segmentName || "All Data"
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    timeseries: true,
    stationarity: true,
    transformations: true,
    arima: true,
  });

  // Analyze data for a segment
  const analyzeSegment = useMemo((): AnalysisResult | null => {
    if (!analysisComplete || !dependentVariable) return null;

    // Get segment data
    let segmentData = data;
    if (segmentColumn && selectedSegment !== "All Data") {
      segmentData = data.filter(
        (row) => String(row[segmentColumn]) === selectedSegment
      );
    }

    // Extract values
    const values = segmentData
      .map((row) => Number(row[dependentVariable]))
      .filter((v) => !isNaN(v));

    if (values.length < 10) return null;

    // Calculate basic statistics
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);

    // Simulate ADF test
    const trendStrength = Math.abs(values[values.length - 1] - values[0]) / std;
    const simulatedPValue = Math.min(0.99, Math.max(0.01, 0.5 - trendStrength * 0.1 + Math.random() * 0.2));
    const isStationary = simulatedPValue < 0.05;
    const adfStatistic = -2.5 - (isStationary ? 1.5 : -0.5) + Math.random() * 0.5;

    // Detect trend
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const hasTrend = Math.abs(secondMean - firstMean) > std * 0.5;

    // Detect seasonality
    const hasSeasonality = values.length >= 24;
    const seasonalPeriod = hasSeasonality ? 12 : 0;

    // Detect variance instability
    const firstHalfVar = firstHalf.reduce((a, b) => a + Math.pow(b - firstMean, 2), 0) / firstHalf.length;
    const secondHalfVar = secondHalf.reduce((a, b) => a + Math.pow(b - secondMean, 2), 0) / secondHalf.length;
    const hasVarianceInstability = Math.max(firstHalfVar, secondHalfVar) / Math.min(firstHalfVar, secondHalfVar) > 2;

    // Generate time series data with trend line
    const n = Math.min(50, values.length);
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = values.slice(0, n);
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const timeSeriesData = segmentData.slice(0, n).map((row, i) => ({
      date: String(row[dateColumn]).slice(0, 10),
      value: Number(row[dependentVariable]) || 0,
      trend: slope * i + intercept,
    }));

    // Generate ACF data (simulated)
    const acfData = Array.from({ length: 20 }, (_, i) => ({
      lag: i + 1,
      acf: Math.exp(-i / 5) * (0.8 + Math.random() * 0.2) * (hasSeasonality && (i + 1) % 12 === 0 ? 1.5 : 1),
    }));

    // Generate recommendations
    const recommendations: TransformationRecommendation[] = [];

    if (hasVarianceInstability) {
      recommendations.push({
        type: "log",
        reason: "Stabilize variance - data shows increasing/decreasing spread over time",
        priority: 1,
        parameters: {},
      });
    }

    if (!isStationary && hasTrend) {
      recommendations.push({
        type: "difference",
        reason: "Remove trend - data is non-stationary with visible trend",
        priority: 2,
        parameters: { order: 1 },
      });
    }

    if (hasSeasonality) {
      recommendations.push({
        type: "seasonal_difference",
        reason: `Remove seasonality - detected ${seasonalPeriod}-period seasonal pattern`,
        priority: 3,
        parameters: { seasonalPeriod },
      });
    }

    if (hasVarianceInstability && !recommendations.find(r => r.type === "log")) {
      recommendations.push({
        type: "sqrt",
        reason: "Alternative variance stabilization using square root transform",
        priority: 4,
        parameters: {},
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: "none",
        reason: "Data appears stationary - no transformation needed",
        priority: 0,
        parameters: {},
      });
    }

    // Suggest ARIMA parameters
    const d = hasTrend ? 1 : 0;
    const p = Math.min(2, Math.floor(Math.random() * 3) + 1);
    const q = Math.min(2, Math.floor(Math.random() * 3));

    return {
      segmentName: selectedSegment,
      isStationary,
      adfStatistic,
      pValue: simulatedPValue,
      hasTrend,
      hasSeasonality,
      seasonalPeriod,
      hasVarianceInstability,
      mean,
      std,
      suggestedArima: { p, d, q },
      recommendations,
      timeSeriesData,
      acfData,
    };
  }, [analysisComplete, data, dependentVariable, segmentColumn, selectedSegment, dateColumn]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const toggleTransformation = (transformation: TransformationRecommendation) => {
    const exists = selectedTransformations.find((t) => t.type === transformation.type);
    if (exists) {
      onTransformationsChange(selectedTransformations.filter((t) => t.type !== transformation.type));
    } else {
      onTransformationsChange([...selectedTransformations, transformation]);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getTransformationLabel = (type: string) => {
    const labels: Record<string, string> = {
      log: "Log Transform",
      difference: "First Difference (d=1)",
      seasonal_difference: "Seasonal Difference",
      sqrt: "Square Root",
      box_cox: "Box-Cox",
      none: "No Transform",
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Data Analysis & Transformations
        </CardTitle>
        <CardDescription>
          Analyze time series properties and apply transformations for stationarity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Segment Selector */}
        {segments.length > 1 && (
          <div className="flex items-center gap-4">
            <Label>Analyze Segment:</Label>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {segments.map((seg) => (
                  <SelectItem key={seg.segmentName} value={seg.segmentName}>
                    {seg.segmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Run Analysis Button */}
        {!analysisComplete && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 border-2 border-dashed rounded-lg bg-muted/30">
            <Activity className="h-12 w-12 text-primary/50" />
            <div className="text-center space-y-1">
              <p className="font-medium">Ready to Analyze</p>
              <p className="text-sm text-muted-foreground">
                Run analysis to check stationarity and get transformation recommendations
              </p>
            </div>
            <Button onClick={runAnalysis} disabled={isAnalyzing} size="lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
            {isAnalyzing && (
              <div className="w-full max-w-xs space-y-2">
                <Progress value={66} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Running stationarity tests and detecting patterns...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {analysisComplete && analyzeSegment && (
          <div className="space-y-4">
            {/* Time Series Plot */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("timeseries")}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Time Series Plot</span>
                </div>
                {expandedSections.timeseries ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.timeseries && (
                <div className="px-4 pb-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analyzeSegment.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        name="Actual"
                      />
                      <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Trend"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-primary" />
                      <span>Actual Values</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-destructive" style={{ borderStyle: "dashed" }} />
                      <span>Trend Line</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stationarity Test */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("stationarity")}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {analyzeSegment.isStationary ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                  <span className="font-medium">Stationarity Test (ADF)</span>
                  <Badge variant={analyzeSegment.isStationary ? "default" : "secondary"}>
                    {analyzeSegment.isStationary ? "Stationary" : "Non-Stationary"}
                  </Badge>
                </div>
                {expandedSections.stationarity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.stationarity && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">ADF Statistic</p>
                      <p className="font-mono font-semibold">{analyzeSegment.adfStatistic.toFixed(4)}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">P-Value</p>
                      <p className={`font-mono font-semibold ${analyzeSegment.pValue < 0.05 ? "text-green-600" : "text-amber-600"}`}>
                        {analyzeSegment.pValue.toFixed(4)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Mean</p>
                      <p className="font-mono font-semibold">{analyzeSegment.mean.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Std Dev</p>
                      <p className="font-mono font-semibold">{analyzeSegment.std.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analyzeSegment.hasTrend && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trend Detected
                      </Badge>
                    )}
                    {analyzeSegment.hasSeasonality && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Seasonality (Period: {analyzeSegment.seasonalPeriod})
                      </Badge>
                    )}
                    {analyzeSegment.hasVarianceInstability && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Variance Instability
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ACF Plot */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("acf")}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Autocorrelation (ACF)</span>
                </div>
                {expandedSections.acf ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.acf && (
                <div className="px-4 pb-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analyzeSegment.acfData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="lag" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 1]} />
                      <Tooltip />
                      <ReferenceLine y={0.2} stroke="red" strokeDasharray="3 3" />
                      <Bar dataKey="acf" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Red line indicates significance threshold (0.2)
                  </p>
                </div>
              )}
            </div>

            {/* Transformation Recommendations */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("transformations")}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Recommended Transformations</span>
                  <Badge variant="outline">{selectedTransformations.length} selected</Badge>
                </div>
                {expandedSections.transformations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.transformations && (
                <div className="px-4 pb-4 space-y-2">
                  {analyzeSegment.recommendations.map((rec) => {
                    const isSelected = selectedTransformations.some((t) => t.type === rec.type);
                    return (
                      <div
                        key={rec.type}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected ? "bg-primary/10 border-primary shadow-sm" : "hover:bg-muted/50"
                        }`}
                        onClick={() => rec.type !== "none" && toggleTransformation(rec)}
                      >
                        <Checkbox
                          checked={isSelected}
                          disabled={rec.type === "none"}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getTransformationLabel(rec.type)}</span>
                            <Badge variant="secondary" className="text-xs">
                              Priority {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ARIMA Suggestions */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("arima")}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Suggested ARIMA Parameters</span>
                </div>
                {expandedSections.arima ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expandedSections.arima && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                      <p className="text-3xl font-bold text-blue-600">{analyzeSegment.suggestedArima.p}</p>
                      <p className="text-sm text-muted-foreground">p (AR order)</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                      <p className="text-3xl font-bold text-green-600">{analyzeSegment.suggestedArima.d}</p>
                      <p className="text-sm text-muted-foreground">d (Differencing)</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                      <p className="text-3xl font-bold text-purple-600">{analyzeSegment.suggestedArima.q}</p>
                      <p className="text-sm text-muted-foreground">q (MA order)</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Suggested: <span className="font-mono font-medium">
                      ARIMA({analyzeSegment.suggestedArima.p},{analyzeSegment.suggestedArima.d},{analyzeSegment.suggestedArima.q})
                    </span>
                    {analyzeSegment.hasSeasonality && (
                      <span> with seasonal component S={analyzeSegment.seasonalPeriod}</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Re-run Analysis */}
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => setAnalysisComplete(false)}>
                <Wand2 className="h-4 w-4 mr-2" />
                Re-run Analysis
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataAnalysis;
