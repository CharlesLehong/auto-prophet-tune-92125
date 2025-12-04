import React, { useMemo } from "react";
import { Settings2, Calendar, Hash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SegmentConfig, DataFrequency } from "@/types/forecast";
import { frequencyNames } from "@/types/forecast";

interface SegmentMapperProps {
  data: Record<string, unknown>[];
  dateColumn: string;
  segmentColumn: string;
  segments: SegmentConfig[];
  onSegmentsChange: (segments: SegmentConfig[]) => void;
}

const SegmentMapper: React.FC<SegmentMapperProps> = ({
  data,
  dateColumn: _dateColumn,
  segmentColumn,
  segments,
  onSegmentsChange,
}) => {
  // dateColumn can be used for future date range display
  void _dateColumn;
  // Extract unique segments from data
  const uniqueSegments = useMemo(() => {
    if (!segmentColumn) return ["All Data"];
    const segmentSet = new Set<string>();
    data.forEach((row) => {
      const value = row[segmentColumn];
      if (value !== null && value !== undefined) {
        segmentSet.add(String(value));
      }
    });
    return Array.from(segmentSet).sort();
  }, [data, segmentColumn]);

  // Calculate record counts per segment
  const segmentRecordCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!segmentColumn) {
      counts["All Data"] = data.length;
      return counts;
    }
    data.forEach((row) => {
      const segment = String(row[segmentColumn] || "Unknown");
      counts[segment] = (counts[segment] || 0) + 1;
    });
    return counts;
  }, [data, segmentColumn]);

  // Initialize segments if empty
  React.useEffect(() => {
    if (segments.length === 0 && uniqueSegments.length > 0) {
      const initialSegments: SegmentConfig[] = uniqueSegments.map((segmentName) => {
        const totalRecords = segmentRecordCounts[segmentName] || 0;
        const testRecords = Math.max(1, Math.floor(totalRecords * 0.2));
        const trainRecords = totalRecords - testRecords;
        return {
          segmentName,
          trainRecords,
          testRecords,
          forecastPeriods: 12,
          frequency: "MS" as DataFrequency,
          regressors: [],
        };
      });
      onSegmentsChange(initialSegments);
    }
  }, [uniqueSegments, segmentRecordCounts, segments.length, onSegmentsChange]);

  const updateSegment = (index: number, updates: Partial<SegmentConfig>) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], ...updates };
    onSegmentsChange(newSegments);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Segment Configuration
        </CardTitle>
        <CardDescription>
          Configure training/test split and forecast horizon for each segment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead className="text-center">Total Records</TableHead>
                <TableHead className="text-center">Train Records</TableHead>
                <TableHead className="text-center">Test Records</TableHead>
                <TableHead className="text-center">Forecast Periods</TableHead>
                <TableHead className="text-center">Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment, index) => (
                <TableRow key={segment.segmentName}>
                  <TableCell className="font-medium">{segment.segmentName}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground">
                      {segmentRecordCounts[segment.segmentName] || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      max={segmentRecordCounts[segment.segmentName] - 1}
                      value={segment.trainRecords}
                      onChange={(e) =>
                        updateSegment(index, { trainRecords: parseInt(e.target.value) || 0 })
                      }
                      className="w-24 mx-auto text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      max={segmentRecordCounts[segment.segmentName] - segment.trainRecords}
                      value={segment.testRecords}
                      onChange={(e) =>
                        updateSegment(index, { testRecords: parseInt(e.target.value) || 0 })
                      }
                      className="w-24 mx-auto text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={segment.forecastPeriods}
                      onChange={(e) =>
                        updateSegment(index, { forecastPeriods: parseInt(e.target.value) || 1 })
                      }
                      className="w-24 mx-auto text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={segment.frequency}
                      onValueChange={(value) =>
                        updateSegment(index, { frequency: value as DataFrequency })
                      }
                    >
                      <SelectTrigger className="w-28 mx-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(frequencyNames).map(([value, name]) => (
                          <SelectItem key={value} value={value}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Train: Data used to fit the model</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="h-4 w-4" />
            <span>Test: Data used to evaluate accuracy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentMapper;
