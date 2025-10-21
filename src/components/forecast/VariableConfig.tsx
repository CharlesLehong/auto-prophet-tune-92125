import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingUp, Layers } from "lucide-react";

interface VariableConfigProps {
  dateColumn: string;
  segmentColumn: string;
  dependentVariable: string;
  availableColumns: string[];
  onDateColumnChange: (value: string) => void;
  onSegmentColumnChange: (value: string) => void;
  onDependentVariableChange: (value: string) => void;
}

export const VariableConfig = ({
  dateColumn,
  segmentColumn,
  dependentVariable,
  availableColumns,
  onDateColumnChange,
  onSegmentColumnChange,
  onDependentVariableChange,
}: VariableConfigProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Variable Configuration</CardTitle>
        <CardDescription>Define your time series structure (stacked/long format)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date-column" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Date/Timestamp Column
          </Label>
          <Select value={dateColumn} onValueChange={onDateColumnChange}>
            <SelectTrigger id="date-column">
              <SelectValue placeholder="Select date column" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {availableColumns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="segment-column" className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Segment Identifier Column
          </Label>
          <Select value={segmentColumn} onValueChange={onSegmentColumnChange}>
            <SelectTrigger id="segment-column">
              <SelectValue placeholder="Select segment column" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {availableColumns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dependent-var" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Dependent Variable Column
          </Label>
          <Select value={dependentVariable} onValueChange={onDependentVariableChange}>
            <SelectTrigger id="dependent-var">
              <SelectValue placeholder="Select dependent variable" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {availableColumns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
