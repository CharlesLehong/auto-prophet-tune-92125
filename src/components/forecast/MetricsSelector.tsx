import React from "react";
import { BarChart3, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { PerformanceMetric } from "@/types/forecast";
import { metricNames } from "@/types/forecast";

interface MetricsSelectorProps {
  selectedMetrics: PerformanceMetric[];
  onMetricsChange: (metrics: PerformanceMetric[]) => void;
}

interface MetricInfo {
  metric: PerformanceMetric;
  description: string;
  formula: string;
  bestFor: string;
}

const metricsInfo: MetricInfo[] = [
  {
    metric: "mae",
    description: "Average absolute difference between predicted and actual values",
    formula: "MAE = (1/n) * |yi - pi|",
    bestFor: "Easy to interpret, same units as data",
  },
  {
    metric: "rmse",
    description: "Square root of the average squared differences",
    formula: "RMSE = ((1/n) * (yi - pi))^0.5",
    bestFor: "Penalizes large errors more heavily",
  },
  {
    metric: "mape",
    description: "Average percentage difference from actual values",
    formula: "MAPE = (100/n) * |yi - pi|/|yi|",
    bestFor: "Scale-independent comparison",
  },
  {
    metric: "smape",
    description: "Symmetric version of MAPE",
    formula: "SMAPE = (100/n) * |yi - pi|/((|yi| + |pi|)/2)",
    bestFor: "Handles zero values better than MAPE",
  },
  {
    metric: "mse",
    description: "Average of squared differences",
    formula: "MSE = (1/n) * (yi - pi)",
    bestFor: "Mathematical convenience, used in optimization",
  },
  {
    metric: "r_squared",
    description: "Proportion of variance explained by the model",
    formula: "R = 1 - SS_res/SS_tot",
    bestFor: "Understanding model fit quality",
  },
  {
    metric: "adjusted_r_squared",
    description: "R-squared adjusted for number of predictors",
    formula: "Adj R = 1 - (1-R)(n-1)/(n-p-1)",
    bestFor: "Comparing models with different features",
  },
  {
    metric: "coverage",
    description: "Percentage of actual values within prediction intervals",
    formula: "Coverage = count(yi in [lo, hi]) / n",
    bestFor: "Evaluating uncertainty estimates",
  },
  {
    metric: "mase",
    description: "Scaled error relative to naive forecast",
    formula: "MASE = MAE / MAE_naive",
    bestFor: "Cross-series comparison",
  },
];

const MetricsSelector: React.FC<MetricsSelectorProps> = ({
  selectedMetrics,
  onMetricsChange,
}) => {
  const toggleMetric = (metric: PerformanceMetric) => {
    if (selectedMetrics.includes(metric)) {
      onMetricsChange(selectedMetrics.filter((m) => m !== metric));
    } else {
      onMetricsChange([...selectedMetrics, metric]);
    }
  };

  const selectAll = () => {
    onMetricsChange(metricsInfo.map((m) => m.metric));
  };

  const selectNone = () => {
    onMetricsChange([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
        <CardDescription>
          Select the metrics to calculate for evaluating forecast accuracy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <button
            onClick={selectAll}
            className="text-sm text-primary hover:underline"
          >
            Select All
          </button>
          <button
            onClick={selectNone}
            className="text-sm text-muted-foreground hover:underline"
          >
            Clear All
          </button>
        </div>

        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricsInfo.map(({ metric, description, formula, bestFor }) => (
              <div
                key={metric}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer
                  ${selectedMetrics.includes(metric) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                onClick={() => toggleMetric(metric)}
              >
                <Checkbox
                  id={metric}
                  checked={selectedMetrics.includes(metric)}
                  onCheckedChange={() => toggleMetric(metric)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <Label htmlFor={metric} className="cursor-pointer font-medium">
                      {metricNames[metric]}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">{description}</p>
                          <p className="text-xs font-mono">{formula}</p>
                          <p className="text-xs text-muted-foreground">Best for: {bestFor}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="font-medium">{selectedMetrics.length}</span> metrics selected
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsSelector;
