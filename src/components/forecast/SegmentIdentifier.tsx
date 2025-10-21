import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layers, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SegmentIdentifierProps {
  segmentColumn: string;
  availableColumns: string[];
  uniqueSegmentValues: string[];
  onSegmentColumnChange: (column: string) => void;
}

export const SegmentIdentifier = ({
  segmentColumn,
  availableColumns,
  uniqueSegmentValues,
  onSegmentColumnChange,
}: SegmentIdentifierProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Segment Identifier Column
        </CardTitle>
        <CardDescription>
          Select the column that identifies different segments in your stacked data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your data should be in long/stacked format where each segment's data is stacked vertically 
            with a column identifying which segment each row belongs to.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="segment-column">Segment Column</Label>
          <Select value={segmentColumn} onValueChange={onSegmentColumnChange}>
            <SelectTrigger id="segment-column">
              <SelectValue placeholder="Select segment identifier column" />
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

        {segmentColumn && uniqueSegmentValues.length > 0 && (
          <div className="space-y-2">
            <Label>Detected Segments ({uniqueSegmentValues.length})</Label>
            <div className="flex flex-wrap gap-2">
              {uniqueSegmentValues.map((value) => (
                <Badge key={value} variant="secondary" className="text-sm">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
