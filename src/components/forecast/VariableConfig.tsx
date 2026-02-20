import React, { useMemo, useEffect } from "react";
import { Calendar, Layers, Target, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VariableConfigProps {
  columns: string[];
  dateColumn: string;
  segmentColumn: string;
  dependentVariable: string;
  onDateColumnChange: (column: string) => void;
  onSegmentColumnChange: (column: string) => void;
  onDependentVariableChange: (column: string) => void;
  data: Record<string, unknown>[];
}

const VariableConfig: React.FC<VariableConfigProps> = ({
  columns,
  dateColumn,
  segmentColumn,
  dependentVariable,
  onDateColumnChange,
  onSegmentColumnChange,
  onDependentVariableChange,
  data,
}) => {
  // Auto-detect likely date columns
  const likelyDateColumns = useMemo(() => {
    return columns.filter((col) => {
      const colLower = col.toLowerCase();
      return (
        colLower.includes("date") ||
        colLower.includes("time") ||
        colLower.includes("day") ||
        colLower.includes("month") ||
        colLower.includes("year")
      );
    });
  }, [columns]);

  // Detect numeric columns for dependent variable
  const numericColumns = useMemo(() => {
    if (data.length === 0) return columns;
    return columns.filter((col) => {
      const sampleValue = data[0][col];
      return typeof sampleValue === "number" || !isNaN(Number(sampleValue));
    });
  }, [columns, data]);

  // Available columns for segment (exclude date and dependent)
  const availableSegmentColumns = useMemo(() => {
    return columns.filter(
      (col) => col !== dateColumn && col !== dependentVariable
    );
  }, [columns, dateColumn, dependentVariable]);

  // Auto-select segment column if "segment" is found
  useEffect(() => {
    if (!segmentColumn && columns.length > 0) {
      const segmentCol = columns.find((col) =>
        col.toLowerCase() === "segment" ||
        col.toLowerCase().includes("segment")
      );
      if (segmentCol) {
        onSegmentColumnChange(segmentCol);
      }
    }
  }, [columns, segmentColumn, onSegmentColumnChange]);

  // Auto-select dependent variable if "dependent" is found
  useEffect(() => {
    if (!dependentVariable && columns.length > 0) {
      const dependentCol = columns.find((col) =>
        col.toLowerCase() === "dependent" ||
        col.toLowerCase().includes("dependent") ||
        col.toLowerCase() === "target" ||
        col.toLowerCase().includes("target") ||
        col.toLowerCase() === "y" ||
        col.toLowerCase() === "value"
      );
      if (dependentCol && numericColumns.includes(dependentCol)) {
        onDependentVariableChange(dependentCol);
      }
    }
  }, [columns, dependentVariable, numericColumns, onDependentVariableChange]);

  // Validation
  const isValid = dateColumn && dependentVariable;
  const hasWarning = !segmentColumn && data.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Variables</CardTitle>
        <CardDescription>
          Select the columns that represent your date, segments, and the variable you want to forecast
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Column Selection */}
        <div className="space-y-2">
          <Label htmlFor="date-column" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Date Column <span className="text-destructive">*</span>
          </Label>
          <Select value={dateColumn} onValueChange={onDateColumnChange}>
            <SelectTrigger id="date-column">
              <SelectValue placeholder="Select date column" />
            </SelectTrigger>
            <SelectContent>
              {likelyDateColumns.length > 0 && (
                <>
                  <SelectItem value="__header__" disabled className="text-xs text-muted-foreground">
                    Suggested
                  </SelectItem>
                  {likelyDateColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                  <SelectItem value="__divider__" disabled className="text-xs text-muted-foreground">
                    All Columns
                  </SelectItem>
                </>
              )}
              {columns
                .filter((col) => !likelyDateColumns.includes(col))
                .map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            The column containing timestamps or dates for your time series
          </p>
        </div>

        {/* Segment Column Selection */}
        <div className="space-y-2">
          <Label htmlFor="segment-column" className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Segment Column <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Select value={segmentColumn || "__none__"} onValueChange={(val) => onSegmentColumnChange(val === "__none__" ? "" : val)}>
            <SelectTrigger id="segment-column">
              <SelectValue placeholder="Select segment column (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">No segmentation</SelectItem>
              {availableSegmentColumns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Use this to forecast multiple series separately (e.g., by product, region, or category)
          </p>
        </div>

        {/* Dependent Variable Selection */}
        <div className="space-y-2">
          <Label htmlFor="dependent-var" className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Target Variable <span className="text-destructive">*</span>
          </Label>
          <Select value={dependentVariable} onValueChange={onDependentVariableChange}>
            <SelectTrigger id="dependent-var">
              <SelectValue placeholder="Select variable to forecast" />
            </SelectTrigger>
            <SelectContent>
              {numericColumns
                .filter((col) => col !== dateColumn && col !== segmentColumn)
                .map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            The numeric column you want to forecast
          </p>
        </div>

        {/* Validation Messages */}
        {!isValid && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select both a date column and a target variable to continue
            </AlertDescription>
          </Alert>
        )}

        {hasWarning && isValid && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No segment column selected. All data will be treated as a single time series.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default VariableConfig;
