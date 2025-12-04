import React from "react";
import { Settings, TrendingUp, Sparkles, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProphetParameters } from "@/types/forecast";

interface ProphetHyperparametersProps {
  parameters: ProphetParameters;
  onParametersChange: (params: ProphetParameters) => void;
}

const ProphetHyperparameters: React.FC<ProphetHyperparametersProps> = ({
  parameters,
  onParametersChange,
}) => {
  const updateParam = <K extends keyof ProphetParameters>(
    key: K,
    value: ProphetParameters[K]
  ) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Prophet Hyperparameters
        </CardTitle>
        <CardDescription>
          Fine-tune the Prophet model parameters for optimal forecasting performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="growth">
              <TrendingUp className="h-4 w-4 mr-1" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="changepoints">
              <Sparkles className="h-4 w-4 mr-1" />
              Changepoints
            </TabsTrigger>
            <TabsTrigger value="seasonality">
              <Calendar className="h-4 w-4 mr-1" />
              Seasonality
            </TabsTrigger>
            <TabsTrigger value="uncertainty">
              Uncertainty
            </TabsTrigger>
          </TabsList>

          {/* Growth Tab */}
          <TabsContent value="growth" className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label>Growth Type</Label>
              <Select
                value={parameters.growthType}
                onValueChange={(value) => updateParam("growthType", value as "linear" | "logistic" | "flat")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear - Constant growth rate</SelectItem>
                  <SelectItem value="logistic">Logistic - Bounded growth with saturation</SelectItem>
                  <SelectItem value="flat">Flat - No trend growth</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how the trend component grows over time
              </p>
            </div>

            {parameters.growthType === "logistic" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Capacity (Cap)</Label>
                  <Input
                    type="number"
                    value={parameters.cap || ""}
                    onChange={(e) => updateParam("cap", parseFloat(e.target.value) || undefined)}
                    placeholder="Maximum value"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Input
                    type="number"
                    value={parameters.floor || ""}
                    onChange={(e) => updateParam("floor", parseFloat(e.target.value) || undefined)}
                    placeholder="Minimum value"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Changepoints Tab */}
          <TabsContent value="changepoints" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Changepoint Prior Scale</Label>
                  <span className="text-sm text-muted-foreground">
                    {parameters.changepointPriorScale.toFixed(3)}
                  </span>
                </div>
                <Slider
                  value={[parameters.changepointPriorScale]}
                  min={0.001}
                  max={0.5}
                  step={0.001}
                  onValueChange={([value]) => updateParam("changepointPriorScale", value)}
                />
                <p className="text-xs text-muted-foreground">
                  Flexibility of trend changes. Higher = more flexible, lower = smoother
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Changepoint Range</Label>
                  <span className="text-sm text-muted-foreground">
                    {(parameters.changepointRange * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[parameters.changepointRange]}
                  min={0.5}
                  max={0.95}
                  step={0.01}
                  onValueChange={([value]) => updateParam("changepointRange", value)}
                />
                <p className="text-xs text-muted-foreground">
                  Proportion of history where changepoints are placed
                </p>
              </div>

              <div className="space-y-2">
                <Label>Number of Changepoints</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={parameters.nChangepoints}
                  onChange={(e) => updateParam("nChangepoints", parseInt(e.target.value) || 25)}
                />
                <p className="text-xs text-muted-foreground">
                  Potential changepoints to include (actual number may be fewer)
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Seasonality Tab */}
          <TabsContent value="seasonality" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Yearly Seasonality</Label>
                  <p className="text-xs text-muted-foreground">Annual patterns in your data</p>
                </div>
                <Switch
                  checked={parameters.yearlySeasonality === true || parameters.yearlySeasonality === "auto"}
                  onCheckedChange={(checked) =>
                    updateParam("yearlySeasonality", checked ? "auto" : false)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Seasonality</Label>
                  <p className="text-xs text-muted-foreground">Day-of-week patterns</p>
                </div>
                <Switch
                  checked={parameters.weeklySeasonality === true || parameters.weeklySeasonality === "auto"}
                  onCheckedChange={(checked) =>
                    updateParam("weeklySeasonality", checked ? "auto" : false)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Seasonality</Label>
                  <p className="text-xs text-muted-foreground">Hour-of-day patterns</p>
                </div>
                <Switch
                  checked={parameters.dailySeasonality === true || parameters.dailySeasonality === "auto"}
                  onCheckedChange={(checked) =>
                    updateParam("dailySeasonality", checked ? "auto" : false)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Seasonality Mode</Label>
                <Select
                  value={parameters.seasonalityMode}
                  onValueChange={(value) =>
                    updateParam("seasonalityMode", value as "additive" | "multiplicative")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="additive">Additive - Constant seasonal effect</SelectItem>
                    <SelectItem value="multiplicative">
                      Multiplicative - Proportional to trend
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Seasonality Prior Scale</Label>
                  <span className="text-sm text-muted-foreground">
                    {parameters.seasonalityPriorScale.toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[parameters.seasonalityPriorScale]}
                  min={0.01}
                  max={20}
                  step={0.1}
                  onValueChange={([value]) => updateParam("seasonalityPriorScale", value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Uncertainty Tab */}
          <TabsContent value="uncertainty" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Confidence Interval Width</Label>
                  <span className="text-sm text-muted-foreground">
                    {(parameters.intervalWidth * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[parameters.intervalWidth]}
                  min={0.5}
                  max={0.99}
                  step={0.01}
                  onValueChange={([value]) => updateParam("intervalWidth", value)}
                />
                <p className="text-xs text-muted-foreground">
                  Width of the uncertainty interval in forecasts
                </p>
              </div>

              <div className="space-y-2">
                <Label>Uncertainty Samples</Label>
                <Input
                  type="number"
                  min={100}
                  max={10000}
                  step={100}
                  value={parameters.uncertaintySamples}
                  onChange={(e) =>
                    updateParam("uncertaintySamples", parseInt(e.target.value) || 1000)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Number of samples for uncertainty estimation (higher = more accurate but slower)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProphetHyperparameters;
