import React, { useMemo } from "react";
import { Target, Calendar, TrendingUp, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  dateColumn,
  segmentColumn,
  segments,
  onSegmentsChange,
}) => {
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

  // Calculate record counts and date ranges per segment
  const segmentAnalysis = useMemo(() => {
    const analysis: Record<string, { count: number; firstDate: string; lastDate: string }> = {};

    if (!segmentColumn) {
      const dates = data
        .map((row) => row[dateColumn])
        .filter((d) => d)
        .map((d) => new Date(String(d)))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

      analysis["All Data"] = {
        count: data.length,
        firstDate: dates[0]?.toLocaleDateString() || "N/A",
        lastDate: dates[dates.length - 1]?.toLocaleDateString() || "N/A",
      };
      return analysis;
    }

    data.forEach((row) => {
      const segment = String(row[segmentColumn] || "Unknown");
      if (!analysis[segment]) {
        analysis[segment] = { count: 0, firstDate: "", lastDate: "" };
      }
      analysis[segment].count++;
    });

    // Get date ranges for each segment
    Object.keys(analysis).forEach((seg) => {
      const segmentData = data.filter((row) => String(row[segmentColumn]) === seg);
      const dates = segmentData
        .map((row) => row[dateColumn])
        .filter((d) => d)
        .map((d) => new Date(String(d)))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

      analysis[seg].firstDate = dates[0]?.toLocaleDateString() || "N/A";
      analysis[seg].lastDate = dates[dates.length - 1]?.toLocaleDateString() || "N/A";
    });

    return analysis;
  }, [data, segmentColumn, dateColumn]);

  // Get selected segment names
  const selectedSegmentNames = useMemo(() => {
    return new Set(segments.map((s) => s.segmentName));
  }, [segments]);

  // Auto-initialize "All Data" when no segment column selected
  React.useEffect(() => {
    if (!segmentColumn && segments.length === 0 && data.length > 0) {
      const totalRecords = data.length;
      const testRecords = Math.max(1, Math.floor(totalRecords * 0.1));
      const trainRecords = totalRecords - testRecords;
      onSegmentsChange([{
        segmentName: "All Data",
        trainRecords,
        testRecords,
        forecastPeriods: 24,
        frequency: "MS" as DataFrequency,
        regressors: [],
      }]);
    }
  }, [segmentColumn, segments.length, data.length, onSegmentsChange]);

  // Toggle segment selection
  const toggleSegment = (segmentName: string) => {
    if (selectedSegmentNames.has(segmentName)) {
      onSegmentsChange(segments.filter((s) => s.segmentName !== segmentName));
    } else {
      const totalRecords = segmentAnalysis[segmentName]?.count || 0;
      const testRecords = Math.max(1, Math.floor(totalRecords * 0.1));
      const trainRecords = totalRecords - testRecords;
      onSegmentsChange([...segments, {
        segmentName,
        trainRecords,
        testRecords,
        forecastPeriods: 24,
        frequency: "MS" as DataFrequency,
        regressors: [],
      }]);
    }
  };

  // Select all segments
  const selectAll = () => {
    if (selectedSegmentNames.size === uniqueSegments.length) {
      onSegmentsChange([]);
    } else {
      const allSegments: SegmentConfig[] = uniqueSegments.map((segmentName) => {
        const existing = segments.find((s) => s.segmentName === segmentName);
        if (existing) return existing;

        const totalRecords = segmentAnalysis[segmentName]?.count || 0;
        const testRecords = Math.max(1, Math.floor(totalRecords * 0.1));
        const trainRecords = totalRecords - testRecords;
        return {
          segmentName,
          trainRecords,
          testRecords,
          forecastPeriods: 24,
          frequency: "MS" as DataFrequency,
          regressors: [],
        };
      });
      onSegmentsChange(allSegments);
    }
  };

  const updateSegment = (segmentName: string, updates: Partial<SegmentConfig>) => {
    onSegmentsChange(
      segments.map((s) => (s.segmentName === segmentName ? { ...s, ...updates } : s))
    );
  };

  const removeSegment = (segmentName: string) => {
    onSegmentsChange(segments.filter((s) => s.segmentName !== segmentName));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Segment Selection & Configuration
        </CardTitle>
        <CardDescription>
          Select which segments to include and configure their forecast settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Segment Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Available Segments</Label>
            <Button variant="link" size="sm" onClick={selectAll} className="h-auto p-0">
              {selectedSegmentNames.size === uniqueSegments.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {uniqueSegments.map((segmentName) => {
              const isSelected = selectedSegmentNames.has(segmentName);
              const analysis = segmentAnalysis[segmentName];

              return (
                <div
                  key={segmentName}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card hover:bg-muted/50 hover:border-muted-foreground/30"
                  }`}
                  onClick={() => toggleSegment(segmentName)}
                >
                  <Checkbox checked={isSelected} className="pointer-events-none" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{segmentName}</p>
                    <p className="text-xs text-muted-foreground">{analysis?.count || 0} records</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Segments Configuration */}
        {segments.length > 0 ? (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Configure Selected Segments</Label>
            {segments.map((segment) => {
              const analysis = segmentAnalysis[segment.segmentName];
              const totalRecords = analysis?.count || 0;
              const trainPercent = totalRecords > 0 ? Math.round((segment.trainRecords / totalRecords) * 100) : 0;

              return (
                <Card key={segment.segmentName} className="border-2">
                  <CardContent className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-sm px-3 py-1">
                          {segment.segmentName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {segment.regressors?.length || 0} regressors
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSegment(segment.segmentName)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Data Summary */}
                    <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Total Records</div>
                        <div className="text-lg font-semibold">{totalRecords}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Date Range
                        </div>
                        <div className="text-xs font-medium">
                          {analysis?.firstDate} - {analysis?.lastDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Frequency
                        </div>
                        <Select
                          value={segment.frequency}
                          onValueChange={(value) =>
                            updateSegment(segment.segmentName, { frequency: value as DataFrequency })
                          }
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(frequencyNames).map(([value, name]) => (
                              <SelectItem key={value} value={value} className="text-xs">
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Training/Testing Split Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">
                          Training Records: <span className="font-semibold">{segment.trainRecords}</span>
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          ({trainPercent}% of data)
                        </span>
                      </div>
                      <Slider
                        value={[segment.trainRecords]}
                        onValueChange={([v]) =>
                          updateSegment(segment.segmentName, {
                            trainRecords: v,
                            testRecords: totalRecords - v,
                          })
                        }
                        min={1}
                        max={totalRecords - 1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Training: {segment.trainRecords}</span>
                        <span>Testing: {segment.testRecords}</span>
                      </div>
                    </div>

                    {/* Forecast Periods */}
                    <div className="flex items-center gap-4">
                      <Label className="text-sm whitespace-nowrap">Forecast Periods:</Label>
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        value={segment.forecastPeriods}
                        onChange={(e) =>
                          updateSegment(segment.segmentName, {
                            forecastPeriods: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-24"
                      />
                      <span className="text-xs text-muted-foreground">
                        {frequencyNames[segment.frequency]} periods ahead
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No segments selected.</p>
            <p className="text-sm">Select at least one segment above to configure forecast settings.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SegmentMapper;
