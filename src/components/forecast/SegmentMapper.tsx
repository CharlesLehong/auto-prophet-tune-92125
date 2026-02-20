import React, { useMemo, useState } from "react";
import { Target, Calendar, TrendingUp, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [selectedSegmentValue, setSelectedSegmentValue] = useState<string>("");

  // Extract unique segments from data
  const uniqueSegmentValues = useMemo(() => {
    if (!segmentColumn) return [];
    const segmentSet = new Set<string>();
    data.forEach((row) => {
      const value = row[segmentColumn];
      if (value !== null && value !== undefined && String(value).trim() !== "") {
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

    // Count records per segment
    uniqueSegmentValues.forEach((seg) => {
      const segmentData = data.filter((row) => String(row[segmentColumn]) === seg);
      const dates = segmentData
        .map((row) => row[dateColumn])
        .filter((d) => d)
        .map((d) => new Date(String(d)))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

      analysis[seg] = {
        count: segmentData.length,
        firstDate: dates[0]?.toLocaleDateString() || "N/A",
        lastDate: dates[dates.length - 1]?.toLocaleDateString() || "N/A",
      };
    });

    return analysis;
  }, [data, segmentColumn, dateColumn, uniqueSegmentValues]);

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

  // Get segments that haven't been added yet
  const availableSegments = useMemo(() => {
    const addedNames = new Set(segments.map((s) => s.segmentName));
    return uniqueSegmentValues.filter((seg) => !addedNames.has(seg));
  }, [uniqueSegmentValues, segments]);

  // Add selected segment
  const addSegment = () => {
    if (!selectedSegmentValue) return;

    const analysis = segmentAnalysis[selectedSegmentValue];
    const totalRecords = analysis?.count || 0;
    const testRecords = Math.max(1, Math.floor(totalRecords * 0.1));
    const trainRecords = totalRecords - testRecords;

    onSegmentsChange([...segments, {
      segmentName: selectedSegmentValue,
      trainRecords,
      testRecords,
      forecastPeriods: 24,
      frequency: "MS" as DataFrequency,
      regressors: [],
    }]);
    setSelectedSegmentValue("");
  };

  const updateSegment = (segmentName: string, updates: Partial<SegmentConfig>) => {
    onSegmentsChange(
      segments.map((s) => (s.segmentName === segmentName ? { ...s, ...updates } : s))
    );
  };

  const removeSegment = (segmentName: string) => {
    onSegmentsChange(segments.filter((s) => s.segmentName !== segmentName));
  };

  // If no segment column is selected, show simplified view
  if (!segmentColumn) {
    const segment = segments[0];
    if (!segment) return null;

    const analysis = segmentAnalysis["All Data"];
    const totalRecords = analysis?.count || 0;
    const trainPercent = totalRecords > 0 ? Math.round((segment.trainRecords / totalRecords) * 100) : 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Forecast Configuration
          </CardTitle>
          <CardDescription>
            Configure forecast settings for your data (no segmentation selected)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="border-2">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-sm px-3 py-1">All Data</Badge>
              </div>

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
                    onValueChange={(value) => updateSegment(segment.segmentName, { frequency: value as DataFrequency })}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(frequencyNames).map(([value, name]) => (
                        <SelectItem key={value} value={value} className="text-xs">{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">
                    Training Records: <span className="font-semibold">{segment.trainRecords}</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">({trainPercent}% of data)</span>
                </div>
                <Slider
                  value={[segment.trainRecords]}
                  onValueChange={([v]) => updateSegment(segment.segmentName, {
                    trainRecords: v,
                    testRecords: totalRecords - v,
                  })}
                  min={1}
                  max={Math.max(1, totalRecords - 1)}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Training: {segment.trainRecords}</span>
                  <span>Testing: {segment.testRecords}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-sm whitespace-nowrap">Forecast Periods:</Label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={segment.forecastPeriods}
                  onChange={(e) => updateSegment(segment.segmentName, { forecastPeriods: parseInt(e.target.value) || 1 })}
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground">
                  {frequencyNames[segment.frequency]} periods ahead
                </span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Segment Selection & Configuration
        </CardTitle>
        <CardDescription>
          Select segments from the dropdown and configure their forecast settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Segment Selection Dropdown */}
        <div className="flex gap-2">
          <Select value={selectedSegmentValue} onValueChange={setSelectedSegmentValue}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a segment to add..." />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-60">
                {availableSegments.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    All segments have been added
                  </div>
                ) : (
                  availableSegments.map((segValue) => {
                    const analysis = segmentAnalysis[segValue];
                    return (
                      <SelectItem key={segValue} value={segValue}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{segValue}</span>
                          <span className="text-xs text-muted-foreground">
                            ({analysis?.count || 0} records)
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </ScrollArea>
            </SelectContent>
          </Select>
          <Button onClick={addSegment} disabled={!selectedSegmentValue}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Summary */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{uniqueSegmentValues.length} segments available</p>
              <p className="text-xs text-muted-foreground">{segments.length} selected for forecasting</p>
            </div>
            {segments.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => onSegmentsChange([])}>
                Clear All
              </Button>
            )}
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
                        max={Math.max(1, totalRecords - 1)}
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
            <p className="text-sm">Select a segment from the dropdown above to configure forecast settings.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SegmentMapper;
