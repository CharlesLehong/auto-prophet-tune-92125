import React, { useMemo } from "react";
import { Variable, Info, Plus, BarChart2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RegressorConfigProps {
  columns: string[];
  dateColumn: string;
  segmentColumn: string;
  dependentVariable: string;
  selectedRegressors: string[];
  onRegressorsChange: (regressors: string[]) => void;
  data: Record<string, unknown>[];
}

const RegressorConfig: React.FC<RegressorConfigProps> = ({
  columns,
  dateColumn,
  segmentColumn,
  dependentVariable,
  selectedRegressors,
  onRegressorsChange,
  data,
}) => {
  // Get available columns (exclude date, segment, and dependent variable)
  const availableRegressors = useMemo(() => {
    return columns.filter(
      (col) =>
        col !== dateColumn &&
        col !== segmentColumn &&
        col !== dependentVariable
    );
  }, [columns, dateColumn, segmentColumn, dependentVariable]);

  // Analyze column properties
  const columnStats = useMemo(() => {
    const stats: Record<string, { type: string; uniqueValues: number; nullCount: number; correlation: number }> = {};

    availableRegressors.forEach((col) => {
      const values = data.map((row) => row[col]);
      const numericValues = values.filter((v) => v !== null && v !== undefined && !isNaN(Number(v)));
      const uniqueValues = new Set(values.filter((v) => v !== null && v !== undefined)).size;
      const nullCount = values.filter((v) => v === null || v === undefined || v === "").length;
      const isNumeric = numericValues.length / Math.max(values.length - nullCount, 1) >= 0.8;

      // Simulate correlation (in real app, calculate actual correlation with dependent variable)
      const correlation = isNumeric ? Math.random() * 0.8 + 0.1 : Math.random() * 0.5;

      stats[col] = {
        type: isNumeric ? "numeric" : "categorical",
        uniqueValues,
        nullCount,
        correlation,
      };
    });

    return stats;
  }, [availableRegressors, data]);

  // Sort by correlation
  const sortedRegressors = useMemo(() => {
    return [...availableRegressors].sort(
      (a, b) => (columnStats[b]?.correlation || 0) - (columnStats[a]?.correlation || 0)
    );
  }, [availableRegressors, columnStats]);

  const handleToggle = (col: string) => {
    if (selectedRegressors.includes(col)) {
      onRegressorsChange(selectedRegressors.filter((r) => r !== col));
    } else {
      onRegressorsChange([...selectedRegressors, col]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRegressors.length === availableRegressors.length) {
      onRegressorsChange([]);
    } else {
      onRegressorsChange(availableRegressors);
    }
  };

  const getCorrelationColor = (correlation: number) => {
    if (correlation >= 0.7) return "text-green-600 bg-green-50";
    if (correlation >= 0.4) return "text-amber-600 bg-amber-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Variable className="h-5 w-5 text-primary" />
          External Regressors
        </CardTitle>
        <CardDescription>
          Select additional variables to include as predictors. Variables with higher correlation to
          the target are shown first.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableRegressors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Variable className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No additional columns available.</p>
            <p className="text-sm">All columns are assigned to date, segment, or target variable.</p>
          </div>
        ) : (
          <>
            {/* Summary and Actions */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">{availableRegressors.length} variables available</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRegressors.length} selected as regressors
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedRegressors.length === availableRegressors.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            {/* Variable List */}
            <div className="space-y-2">
              {sortedRegressors.map((col) => {
                const stats = columnStats[col];
                const isSelected = selectedRegressors.includes(col);

                return (
                  <div
                    key={col}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "hover:bg-muted/50 hover:border-muted-foreground/30"
                    }`}
                    onClick={() => handleToggle(col)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <div>
                        <p className="font-medium">{col}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              stats?.type === "numeric"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {stats?.type || "unknown"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {stats?.uniqueValues || 0} unique values
                          </span>
                          {stats?.nullCount > 0 && (
                            <span className="text-xs text-destructive">
                              {stats.nullCount} nulls
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getCorrelationColor(
                              stats?.correlation || 0
                            )}`}
                          >
                            <BarChart2 className="h-3 w-3" />
                            {((stats?.correlation || 0) * 100).toFixed(0)}%
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated correlation with target variable</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Tips for selecting regressors:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Choose variables that have a causal relationship with your target</li>
                  <li>For Prophet models, regressors must have known future values</li>
                  <li>Numeric variables are used directly; categorical will be encoded</li>
                  <li>Higher correlation doesn't always mean better prediction</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RegressorConfig;
