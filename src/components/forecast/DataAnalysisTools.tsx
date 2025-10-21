import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Bar, BarChart } from "recharts";
import { Activity, TrendingUp, Wand2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DataAnalysisToolsProps {
  data: any[];
  dateColumn: string;
  valueColumn: string;
  onTransformationApply: (transformation: any) => void;
}

export const DataAnalysisTools = ({ data, dateColumn, valueColumn, onTransformationApply }: DataAnalysisToolsProps) => {
  const [stationarityTest, setStationarityTest] = useState<any>(null);
  const [acfData, setAcfData] = useState<any>(null);
  const [pacfData, setPacfData] = useState<any>(null);
  const [selectedTransform, setSelectedTransform] = useState<string>("none");
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runStationarityTest = () => {
    // Mock ADF test - in production, this would call a backend function
    const mockResult = {
      test_statistic: -2.5,
      p_value: 0.12,
      critical_values: { "1%": -3.43, "5%": -2.86, "10%": -2.57 },
      is_stationary: false,
      recommendation: "Data appears non-stationary. Consider differencing or detrending.",
    };
    setStationarityTest(mockResult);
  };

  const calculateACF = () => {
    // Mock ACF calculation
    const lags = Array.from({ length: 20 }, (_, i) => i);
    const correlations = lags.map(lag => Math.exp(-lag / 5) * (Math.random() * 0.4 + 0.6));
    setAcfData({
      lags,
      data: lags.map((lag, i) => ({ lag, correlation: correlations[i] })),
      confidence: 1.96 / Math.sqrt(data.length),
    });
  };

  const calculatePACF = () => {
    // Mock PACF calculation
    const lags = Array.from({ length: 20 }, (_, i) => i);
    const correlations = lags.map(lag => lag === 0 ? 1 : Math.exp(-lag / 3) * (Math.random() - 0.5));
    setPacfData({
      lags,
      data: lags.map((lag, i) => ({ lag, correlation: correlations[i] })),
      confidence: 1.96 / Math.sqrt(data.length),
    });
  };

  const getAIInsights = async () => {
    setIsAnalyzing(true);
    // Mock AI insights - in production, call Gemini
    setTimeout(() => {
      setAiInsights(
        "Based on the analysis:\n\n" +
        "1. The data shows non-stationarity with a p-value of 0.12\n" +
        "2. ACF shows slow decay, suggesting a trend component\n" +
        "3. PACF cuts off after lag 2, suggesting an AR(2) process\n\n" +
        "Recommendation: Apply first-order differencing to achieve stationarity, " +
        "then consider an ARIMA(2,1,0) model."
      );
      setIsAnalyzing(false);
    }, 1500);
  };

  const applyTransformation = () => {
    if (selectedTransform !== "none") {
      onTransformationApply({ type: selectedTransform, applied: true });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Time Series Analysis Tools
          </CardTitle>
          <CardDescription>
            Analyze data properties and apply transformations for better forecasting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stationarity" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stationarity">Stationarity</TabsTrigger>
              <TabsTrigger value="acf">ACF</TabsTrigger>
              <TabsTrigger value="pacf">PACF</TabsTrigger>
              <TabsTrigger value="transform">Transform</TabsTrigger>
            </TabsList>

            <TabsContent value="stationarity" className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={runStationarityTest} variant="outline">
                  Run Augmented Dickey-Fuller Test
                </Button>
                <Button onClick={getAIInsights} variant="outline" disabled={isAnalyzing}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isAnalyzing ? "Analyzing..." : "Get AI Insights"}
                </Button>
              </div>

              {stationarityTest && (
                <Alert variant={stationarityTest.is_stationary ? "default" : "destructive"}>
                  {stationarityTest.is_stationary ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {stationarityTest.is_stationary ? "Data is stationary" : "Data is non-stationary"}
                      </p>
                      <div className="text-sm space-y-1">
                        <p>Test Statistic: {stationarityTest.test_statistic.toFixed(3)}</p>
                        <p>P-value: {stationarityTest.p_value.toFixed(3)}</p>
                        <p>Critical Values: 1%={stationarityTest.critical_values["1%"]}, 5%={stationarityTest.critical_values["5%"]}, 10%={stationarityTest.critical_values["10%"]}</p>
                      </div>
                      <p className="text-sm mt-2">{stationarityTest.recommendation}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {aiInsights && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      AI-Powered Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{aiInsights}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="acf" className="space-y-4">
              <Button onClick={calculateACF} variant="outline">
                Calculate Autocorrelation Function
              </Button>

              {acfData && (
                <div>
                  <h4 className="text-sm font-semibold mb-4">Autocorrelation Function (ACF)</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={acfData.data}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="lag" label={{ value: "Lag", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "Correlation", angle: -90, position: "insideLeft" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <ReferenceLine y={acfData.confidence} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                      <ReferenceLine y={-acfData.confidence} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                      <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                      <Bar dataKey="correlation" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Blue dashed lines represent 95% confidence intervals. Bars extending beyond these lines indicate significant autocorrelation.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pacf" className="space-y-4">
              <Button onClick={calculatePACF} variant="outline">
                Calculate Partial Autocorrelation Function
              </Button>

              {pacfData && (
                <div>
                  <h4 className="text-sm font-semibold mb-4">Partial Autocorrelation Function (PACF)</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pacfData.data}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="lag" label={{ value: "Lag", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "Correlation", angle: -90, position: "insideLeft" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <ReferenceLine y={pacfData.confidence} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                      <ReferenceLine y={-pacfData.confidence} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                      <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                      <Bar dataKey="correlation" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Blue dashed lines represent 95% confidence intervals. Significant spikes suggest AR order.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transform" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Transformation</Label>
                  <Select value={selectedTransform} onValueChange={setSelectedTransform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="log">Log Transform</SelectItem>
                      <SelectItem value="difference">First Difference</SelectItem>
                      <SelectItem value="seasonal_difference">Seasonal Difference</SelectItem>
                      <SelectItem value="box_cox">Box-Cox Transform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={applyTransformation} 
                    disabled={selectedTransform === "none"}
                  >
                    Apply Transformation
                  </Button>
                  <Button 
                    onClick={getAIInsights} 
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI-Recommended Transform
                  </Button>
                </div>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-semibold mb-2">Transformation Guide:</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li><strong>Log:</strong> Stabilizes variance when it increases with level</li>
                      <li><strong>First Difference:</strong> Removes trend and achieves stationarity</li>
                      <li><strong>Seasonal Difference:</strong> Removes seasonal patterns</li>
                      <li><strong>Box-Cox:</strong> Automatically finds optimal power transformation</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
