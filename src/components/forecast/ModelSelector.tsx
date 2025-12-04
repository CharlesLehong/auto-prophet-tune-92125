import React from "react";
import { TrendingUp, Zap, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { ForecastModel } from "@/types/forecast";

interface ModelSelectorProps {
  selectedModel: ForecastModel;
  onModelChange: (model: ForecastModel) => void;
}

interface ModelOption {
  value: ForecastModel;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  status: "available" | "coming_soon";
}

const modelOptions: ModelOption[] = [
  {
    value: "prophet",
    name: "Prophet",
    description: "Facebook's robust forecasting model with automatic seasonality detection",
    icon: <TrendingUp className="h-6 w-6" />,
    features: ["Automatic seasonality", "Holiday effects", "Trend changepoints", "Uncertainty intervals"],
    status: "available",
  },
  {
    value: "autogluon",
    name: "AutoGluon",
    description: "AutoML framework that automatically trains and ensembles multiple models",
    icon: <Zap className="h-6 w-6" />,
    features: ["Automatic model selection", "Ensemble methods", "Feature engineering", "Multi-model comparison"],
    status: "available",
  },
  {
    value: "arima",
    name: "ARIMA",
    description: "Classic statistical model for time series analysis",
    icon: <BarChart3 className="h-6 w-6" />,
    features: ["Auto-regressive", "Integrated", "Moving average", "Seasonal variants"],
    status: "coming_soon",
  },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Forecasting Model</CardTitle>
        <CardDescription>
          Choose the forecasting algorithm that best fits your data characteristics and requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedModel}
          onValueChange={(value) => onModelChange(value as ForecastModel)}
          className="grid gap-4"
        >
          {modelOptions.map((model) => (
            <div key={model.value} className="relative">
              <RadioGroupItem
                value={model.value}
                id={model.value}
                className="peer sr-only"
                disabled={model.status === "coming_soon"}
              />
              <Label
                htmlFor={model.value}
                className={`flex items-start gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all
                  peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                  hover:bg-muted/50
                  ${model.status === "coming_soon" ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {model.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{model.name}</span>
                    {model.status === "coming_soon" && (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {model.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs font-normal">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ModelSelector;
