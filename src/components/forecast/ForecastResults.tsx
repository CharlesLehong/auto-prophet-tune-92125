import React, { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { Download, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ForecastResults as ForecastResultsType } from "@/types/forecastResults";
import { metricNames } from "@/types/forecast";

interface ForecastResultsProps {
  results: ForecastResultsType;
  onExport?: (format: "csv" | "json") => void;
}

const ForecastResults: React.FC<ForecastResultsProps> = ({ results, onExport }) => {
  const [selectedSegment, setSelectedSegment] = useState<string>(
    results.segmentResults[0]?.segmentName || ""
  );

  const currentSegmentResult = results.segmentResults.find(
    (r) => r.segmentName === selectedSegment
  );

  const formatNumber = (num: number | null, decimals = 2): string => {
    if (num === null || num === undefined) return "N/A";
    return num.toFixed(decimals);
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  if (!currentSegmentResult) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No forecast results available</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = currentSegmentResult.forecastData.map((point) => ({
    date: formatDate(point.date),
    actual: point.actual,
    predicted: point.predicted,
    lower: point.lowerBound,
    upper: point.upperBound,
    isForecast: point.isForecast,
    isTest: point.isTestSet,
  }));

  // Find the split point for visualization
  const testStartIndex = chartData.findIndex((d) => d.isTest);
  const forecastStartIndex = chartData.findIndex((d) => d.isForecast);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Forecast Results
            </CardTitle>
            <CardDescription>
              Generated on {new Date(results.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {results.segmentResults.length > 1 && (
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  {results.segmentResults.map((result) => (
                    <SelectItem key={result.segmentName} value={result.segmentName}>
                      {result.segmentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={() => onExport("csv")}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Chart Tab */}
          <TabsContent value="chart" className="mt-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />

                  {/* Confidence interval area */}
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="none"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    name="Upper Bound"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="none"
                    fill="hsl(var(--background))"
                    fillOpacity={1}
                    name="Lower Bound"
                  />

                  {/* Actual values */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={false}
                    name="Actual"
                  />

                  {/* Predicted values */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Predicted"
                  />

                  {/* Reference lines for splits */}
                  {testStartIndex > 0 && (
                    <ReferenceLine
                      x={chartData[testStartIndex]?.date}
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="3 3"
                      label={{ value: "Test Start", position: "top", fontSize: 10 }}
                    />
                  )}
                  {forecastStartIndex > 0 && (
                    <ReferenceLine
                      x={chartData[forecastStartIndex]?.date}
                      stroke="hsl(var(--primary))"
                      strokeDasharray="3 3"
                      label={{ value: "Forecast Start", position: "top", fontSize: 10 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-4 mt-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-foreground"></div>
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-primary" style={{ borderStyle: "dashed" }}></div>
                <span>Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/10 rounded"></div>
                <span>Confidence Interval</span>
              </div>
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Training Set</TableHead>
                    <TableHead className="text-right">Test Set</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSegmentResult.metrics.map((m) => (
                    <TableRow key={m.metric}>
                      <TableCell className="font-medium">
                        {metricNames[m.metric]}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {m.metric.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(m.trainValue)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(m.testValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {currentSegmentResult.aiCommentary && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">{currentSegmentResult.aiCommentary}</p>
              </div>
            )}
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="mt-4">
            <div className="max-h-[400px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Predicted</TableHead>
                    <TableHead className="text-right">Lower</TableHead>
                    <TableHead className="text-right">Upper</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSegmentResult.forecastData.map((point, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{formatDate(point.date)}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(point.actual)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(point.predicted)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {formatNumber(point.lowerBound)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {formatNumber(point.upperBound)}
                      </TableCell>
                      <TableCell className="text-center">
                        {point.isForecast ? (
                          <Badge>Forecast</Badge>
                        ) : point.isTestSet ? (
                          <Badge variant="secondary">Test</Badge>
                        ) : (
                          <Badge variant="outline">Train</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ForecastResults;
