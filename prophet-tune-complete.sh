#!/bin/bash

# Prophet-Tune Project Generator
# Run this script to create the complete project structure

set -e

echo "Creating Prophet-Tune project..."

# Create directory structure
mkdir -p src/{components/{ui,forecast},hooks,integrations/supabase,lib,pages,types,utils}

# ============================================
# ROOT CONFIG FILES
# ============================================

cat > package.json << 'ENDOFFILE'
{
  "name": "prophet-tune-new",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@supabase/supabase-js": "^2.86.0",
    "@tanstack/react-query": "^5.90.11",
    "@types/papaparse": "^5.5.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.555.0",
    "papaparse": "^5.5.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.68.0",
    "react-router-dom": "^7.10.0",
    "recharts": "^3.5.1",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^4.1.13"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/typography": "^0.5.19",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.22",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}
ENDOFFILE

cat > vite.config.ts << 'ENDOFFILE'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
ENDOFFILE

cat > tailwind.config.ts << 'ENDOFFILE'
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
ENDOFFILE

cat > tsconfig.json << 'ENDOFFILE'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
ENDOFFILE

cat > tsconfig.app.json << 'ENDOFFILE'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
ENDOFFILE

cat > tsconfig.node.json << 'ENDOFFILE'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
ENDOFFILE

cat > postcss.config.js << 'ENDOFFILE'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
ENDOFFILE

cat > eslint.config.js << 'ENDOFFILE'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
ENDOFFILE

cat > index.html << 'ENDOFFILE'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>prophet-tune-new</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
ENDOFFILE

cat > .gitignore << 'ENDOFFILE'
# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
dist
dist-ssr
*.local

# Environment files
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Editor directories
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS files
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
ENDOFFILE

# ============================================
# SRC FILES
# ============================================

cat > src/main.tsx << 'ENDOFFILE'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
ENDOFFILE

cat > src/App.tsx << 'ENDOFFILE'
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  // For demo purposes, we'll skip auth and go directly to the main app
  // In production, you would check authentication state here
  const isAuthenticated = true;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Index /> : <Navigate to="/auth" replace />}
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
};

export default App;
ENDOFFILE

cat > src/App.css << 'ENDOFFILE'
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
ENDOFFILE

cat > src/index.css << 'ENDOFFILE'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground min-h-screen;
  }
}
ENDOFFILE

# ============================================
# LIB
# ============================================

cat > src/lib/utils.ts << 'ENDOFFILE'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
ENDOFFILE

# ============================================
# TYPES
# ============================================

cat > src/types/forecast.ts << 'ENDOFFILE'
// Forecasting model types
export type ForecastModel = "prophet" | "autogluon" | "arima" | "ar" | "arma";

// Data frequency types
export type DataFrequency = "D" | "W" | "MS" | "QS" | "YS";

// Performance metrics
export type PerformanceMetric =
  | "mae"
  | "rmse"
  | "mape"
  | "mse"
  | "r_squared"
  | "adjusted_r_squared"
  | "coverage"
  | "smape"
  | "mase";

// Regressor configuration
export interface RegressorConfig {
  name: string;
  enabled: boolean;
  mode: "additive" | "multiplicative";
  standardize: boolean;
}

// Custom seasonality configuration
export interface SeasonalityConfig {
  name: string;
  period: number;
  fourierOrder: number;
  mode: "additive" | "multiplicative";
}

// Segment configuration for multi-segment forecasting
export interface SegmentConfig {
  segmentName: string;
  trainRecords: number;
  testRecords: number;
  forecastPeriods: number;
  frequency: DataFrequency;
  regressors: RegressorConfig[];
  startDate?: string;
  endDate?: string;
}

// Prophet-specific parameters
export interface ProphetParameters {
  // Growth
  growthType: "linear" | "logistic" | "flat";
  cap?: number;
  floor?: number;

  // Changepoints
  changepointPriorScale: number;
  changepointRange: number;
  nChangepoints: number;
  changepoints?: string[];

  // Seasonality
  yearlySeasonality: boolean | "auto" | number;
  weeklySeasonality: boolean | "auto" | number;
  dailySeasonality: boolean | "auto" | number;
  seasonalityMode: "additive" | "multiplicative";
  seasonalityPriorScale: number;

  // Holidays
  holidayPriorScale: number;
  holidays?: string;
  countryHolidays?: string;

  // Uncertainty
  intervalWidth: number;
  uncertaintySamples: number;

  // Custom seasonalities
  customSeasonalities: SeasonalityConfig[];
}

// Complete forecast configuration
export interface ForecastConfig {
  model: ForecastModel;
  dateColumn: string;
  segmentColumn: string;
  dependentVariable: string;
  segments: SegmentConfig[];
  prophetParams: ProphetParameters;
  selectedMetrics: PerformanceMetric[];
}

// Default Prophet parameters
export const defaultProphetParams: ProphetParameters = {
  growthType: "linear",
  changepointPriorScale: 0.05,
  changepointRange: 0.8,
  nChangepoints: 25,
  yearlySeasonality: "auto",
  weeklySeasonality: "auto",
  dailySeasonality: "auto",
  seasonalityMode: "additive",
  seasonalityPriorScale: 10,
  holidayPriorScale: 10,
  intervalWidth: 0.8,
  uncertaintySamples: 1000,
  customSeasonalities: [],
};

// Frequency display names
export const frequencyNames: Record<DataFrequency, string> = {
  D: "Daily",
  W: "Weekly",
  MS: "Monthly",
  QS: "Quarterly",
  YS: "Yearly",
};

// Metric display names
export const metricNames: Record<PerformanceMetric, string> = {
  mae: "Mean Absolute Error",
  rmse: "Root Mean Squared Error",
  mape: "Mean Absolute Percentage Error",
  mse: "Mean Squared Error",
  r_squared: "R-Squared",
  adjusted_r_squared: "Adjusted R-Squared",
  coverage: "Prediction Interval Coverage",
  smape: "Symmetric MAPE",
  mase: "Mean Absolute Scaled Error",
};
ENDOFFILE

cat > src/types/forecastResults.ts << 'ENDOFFILE'
import type { PerformanceMetric, DataFrequency } from "./forecast";

// Single forecast data point
export interface ForecastPoint {
  date: string;
  actual: number | null;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  isForecast: boolean;
  isTestSet: boolean;
}

// Metrics calculation result
export interface MetricsResult {
  metric: PerformanceMetric;
  trainValue: number | null;
  testValue: number | null;
}

// Transformation applied to data
export interface AppliedTransformation {
  type: "log" | "difference" | "seasonal_difference" | "sqrt" | "box_cox";
  order?: number;
  seasonalPeriod?: number;
  lambda?: number;
}

// Single segment forecast result
export interface SegmentForecastResult {
  segmentName: string;
  frequency: DataFrequency;
  forecastData: ForecastPoint[];
  metrics: MetricsResult[];
  transformationsApplied: AppliedTransformation[];
  aiCommentary?: string;
  modelConfig: Record<string, unknown>;
  trainStartDate: string;
  trainEndDate: string;
  testStartDate?: string;
  testEndDate?: string;
  forecastStartDate: string;
  forecastEndDate: string;
}

// Complete forecast results
export interface ForecastResults {
  timestamp: string;
  modelType: string;
  segmentResults: SegmentForecastResult[];
  overallSummary?: string;
}

// Export format options
export type ExportFormat = "csv" | "json" | "html" | "pdf";

// Chart display options
export interface ChartOptions {
  showActual: boolean;
  showPredicted: boolean;
  showConfidenceInterval: boolean;
  showTrainTestSplit: boolean;
  chartHeight: number;
}

export const defaultChartOptions: ChartOptions = {
  showActual: true,
  showPredicted: true,
  showConfidenceInterval: true,
  showTrainTestSplit: true,
  chartHeight: 400,
};
ENDOFFILE

cat > src/types/dataAnalysis.ts << 'ENDOFFILE'
// Data analysis and transformation types

// Stationarity test results
export interface StationarityTestResult {
  testStatistic: number;
  pValue: number;
  criticalValues: Record<string, number>;
  isStationary: boolean;
  recommendation: string;
}

// Autocorrelation results
export interface AutocorrelationResult {
  lag: number;
  acf: number;
  pacf: number;
  significanceBound: number;
}

// Transformation recommendation
export interface TransformationRecommendation {
  type: "log" | "difference" | "seasonal_difference" | "sqrt" | "box_cox" | "none";
  reason: string;
  priority: number;
  parameters?: {
    order?: number;
    seasonalPeriod?: number;
    lambda?: number;
  };
}

// Data characteristics
export interface DataCharacteristics {
  hasTrend: boolean;
  hasSeasonality: boolean;
  seasonalPeriod?: number;
  hasVarianceInstability: boolean;
  hasOutliers: boolean;
  outlierCount: number;
  missingValueCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  recordCount: number;
}

// Complete analysis result for a segment
export interface SegmentAnalysisResult {
  segmentName: string;
  characteristics: DataCharacteristics;
  stationarityTest: StationarityTestResult;
  autocorrelation: AutocorrelationResult[];
  recommendations: TransformationRecommendation[];
  transformedStationarityTest?: StationarityTestResult;
}

// Analysis state for UI
export interface AnalysisState {
  isLoading: boolean;
  isComplete: boolean;
  error?: string;
  result?: SegmentAnalysisResult;
  selectedTransformations: TransformationRecommendation[];
}
ENDOFFILE

# ============================================
# HOOKS
# ============================================

cat > src/hooks/useToast.ts << 'ENDOFFILE'
import { toast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const showSuccess = (options: ToastOptions) => {
    toast.success(options.title, {
      description: options.description,
      duration: options.duration || 3000,
    });
  };

  const showError = (options: ToastOptions) => {
    toast.error(options.title, {
      description: options.description,
      duration: options.duration || 5000,
    });
  };

  const showWarning = (options: ToastOptions) => {
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration || 4000,
    });
  };

  const showInfo = (options: ToastOptions) => {
    toast.info(options.title, {
      description: options.description,
      duration: options.duration || 3000,
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    dismiss,
  };
}
ENDOFFILE

cat > src/hooks/useMobile.ts << 'ENDOFFILE'
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}
ENDOFFILE

# ============================================
# UTILS
# ============================================

cat > src/utils/dataAnalysis.ts << 'ENDOFFILE'
import type { DataFrequency, PerformanceMetric } from "@/types/forecast";

/**
 * Check if a column contains numeric values
 */
export function isNumericColumn(data: Record<string, unknown>[], column: string): boolean {
  if (data.length === 0) return false;

  const sampleSize = Math.min(10, data.length);
  let numericCount = 0;

  for (let i = 0; i < sampleSize; i++) {
    const value = data[i][column];
    if (value !== null && value !== undefined && !isNaN(Number(value))) {
      numericCount++;
    }
  }

  return numericCount / sampleSize >= 0.8;
}

/**
 * Get all numeric columns from data
 */
export function getNumericColumns(
  data: Record<string, unknown>[],
  columns: string[]
): string[] {
  return columns.filter((col) => isNumericColumn(data, col));
}

/**
 * Detect data frequency from dates
 */
export function detectFrequency(dates: Date[]): DataFrequency {
  if (dates.length < 2) return "D";

  const diffs: number[] = [];
  for (let i = 1; i < Math.min(dates.length, 10); i++) {
    diffs.push(dates[i].getTime() - dates[i - 1].getTime());
  }

  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const days = avgDiff / (1000 * 60 * 60 * 24);

  if (days < 2) return "D";
  if (days < 10) return "W";
  if (days < 60) return "MS";
  if (days < 200) return "QS";
  return "YS";
}

/**
 * Calculate Mean Absolute Error
 */
export function calculateMAE(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length || actual.length === 0) return NaN;

  const sum = actual.reduce((acc, val, i) => {
    return acc + Math.abs(val - predicted[i]);
  }, 0);

  return sum / actual.length;
}

/**
 * Calculate Root Mean Squared Error
 */
export function calculateRMSE(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length || actual.length === 0) return NaN;

  const sum = actual.reduce((acc, val, i) => {
    return acc + Math.pow(val - predicted[i], 2);
  }, 0);

  return Math.sqrt(sum / actual.length);
}

/**
 * Calculate Mean Absolute Percentage Error
 */
export function calculateMAPE(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length || actual.length === 0) return NaN;

  const nonZeroIndices = actual
    .map((val, i) => (val !== 0 ? i : -1))
    .filter((i) => i !== -1);

  if (nonZeroIndices.length === 0) return NaN;

  const sum = nonZeroIndices.reduce((acc, i) => {
    return acc + Math.abs((actual[i] - predicted[i]) / actual[i]);
  }, 0);

  return (sum / nonZeroIndices.length) * 100;
}

/**
 * Calculate R-squared
 */
export function calculateRSquared(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length || actual.length === 0) return NaN;

  const mean = actual.reduce((a, b) => a + b, 0) / actual.length;

  const ssRes = actual.reduce((acc, val, i) => {
    return acc + Math.pow(val - predicted[i], 2);
  }, 0);

  const ssTot = actual.reduce((acc, val) => {
    return acc + Math.pow(val - mean, 2);
  }, 0);

  if (ssTot === 0) return NaN;

  return 1 - ssRes / ssTot;
}

/**
 * Calculate coverage (percentage of actuals within prediction intervals)
 */
export function calculateCoverage(
  actual: number[],
  lower: number[],
  upper: number[]
): number {
  if (actual.length === 0) return NaN;

  const covered = actual.filter((val, i) => val >= lower[i] && val <= upper[i]).length;

  return (covered / actual.length) * 100;
}

/**
 * Calculate a specific metric
 */
export function calculateMetric(
  metric: PerformanceMetric,
  actual: number[],
  predicted: number[],
  lower?: number[],
  upper?: number[]
): number {
  switch (metric) {
    case "mae":
      return calculateMAE(actual, predicted);
    case "rmse":
      return calculateRMSE(actual, predicted);
    case "mape":
      return calculateMAPE(actual, predicted);
    case "mse":
      return Math.pow(calculateRMSE(actual, predicted), 2);
    case "r_squared":
      return calculateRSquared(actual, predicted);
    case "coverage":
      if (!lower || !upper) return NaN;
      return calculateCoverage(actual, lower, upper);
    case "smape":
      // Symmetric MAPE
      if (actual.length === 0) return NaN;
      const smapeSum = actual.reduce((acc, val, i) => {
        const denom = Math.abs(val) + Math.abs(predicted[i]);
        return acc + (denom === 0 ? 0 : Math.abs(val - predicted[i]) / denom);
      }, 0);
      return (smapeSum / actual.length) * 100;
    default:
      return NaN;
  }
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Parse CSV date string to Date object
 */
export function parseDate(dateStr: string): Date | null {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}
ENDOFFILE

# ============================================
# INTEGRATIONS / SUPABASE
# ============================================

cat > src/integrations/supabase/client.ts << 'ENDOFFILE'
import { createClient } from "@supabase/supabase-js";

// These would normally come from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Type-safe helper for calling edge functions
export async function invokeFunction<T = unknown>(
  functionName: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error"),
    };
  }
}
ENDOFFILE

cat > src/integrations/supabase/types.ts << 'ENDOFFILE'
// Database types for Supabase
// These would be auto-generated from your Supabase schema

export interface Database {
  public: {
    Tables: {
      forecasts: {
        Row: {
          id: string;
          user_id: string;
          model_type: string;
          config: Record<string, unknown>;
          results: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["forecasts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["forecasts"]["Insert"]>;
      };
      saved_models: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          model_config: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_models"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["saved_models"]["Insert"]>;
      };
    };
    Functions: {
      // Add any database functions here
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
ENDOFFILE

# ============================================
# PAGES
# ============================================

cat > src/pages/Index.tsx << 'ENDOFFILE'
import React, { useState, useCallback } from "react";
import { LogOut, TrendingUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import DataUpload from "@/components/forecast/DataUpload";
import ModelSelector from "@/components/forecast/ModelSelector";
import VariableConfig from "@/components/forecast/VariableConfig";
import SegmentMapper from "@/components/forecast/SegmentMapper";
import ProphetHyperparameters from "@/components/forecast/ProphetHyperparameters";
import MetricsSelector from "@/components/forecast/MetricsSelector";
import ForecastResults from "@/components/forecast/ForecastResults";
import ForecastProgress from "@/components/forecast/ForecastProgress";
import type { ForecastModel, SegmentConfig, ProphetParameters, PerformanceMetric } from "@/types/forecast";
import type { ForecastResults as ForecastResultsType } from "@/types/forecastResults";
import { defaultProphetParams } from "@/types/forecast";

type WorkflowStep =
  | "upload"
  | "model"
  | "variables"
  | "segments"
  | "analysis"
  | "regressors"
  | "metrics"
  | "parameters"
  | "results";

const workflowSteps: { id: WorkflowStep; label: string; shortLabel: string }[] = [
  { id: "upload", label: "Upload Data", shortLabel: "Upload" },
  { id: "model", label: "Select Model", shortLabel: "Model" },
  { id: "variables", label: "Configure Variables", shortLabel: "Variables" },
  { id: "segments", label: "Segment Mapping", shortLabel: "Segments" },
  { id: "analysis", label: "Data Analysis", shortLabel: "Analysis" },
  { id: "regressors", label: "Regressors", shortLabel: "Regressors" },
  { id: "metrics", label: "Metrics", shortLabel: "Metrics" },
  { id: "parameters", label: "Parameters", shortLabel: "Params" },
  { id: "results", label: "Results", shortLabel: "Results" },
];

const Index: React.FC = () => {
  // Data state
  const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");

  // Configuration state
  const [selectedModel, setSelectedModel] = useState<ForecastModel>("prophet");
  const [dateColumn, setDateColumn] = useState<string>("");
  const [segmentColumn, setSegmentColumn] = useState<string>("");
  const [dependentVariable, setDependentVariable] = useState<string>("");
  const [segments, setSegments] = useState<SegmentConfig[]>([]);
  const [prophetParams, setProphetParams] = useState<ProphetParameters>(defaultProphetParams);
  const [selectedMetrics, setSelectedMetrics] = useState<PerformanceMetric[]>([
    "mae",
    "rmse",
    "mape",
    "r_squared",
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState<WorkflowStep>("upload");
  const [isRunning, setIsRunning] = useState(false);
  const [forecastResults, setForecastResults] = useState<ForecastResultsType | null>(null);

  // Data loading handler
  const handleDataLoaded = useCallback(
    (data: Record<string, unknown>[], cols: string[]) => {
      setCsvData(data);
      setColumns(cols);
      setFileName(`data_${Date.now()}.csv`);

      // Auto-detect date column
      const likelyDateCol = cols.find((col) => {
        const lower = col.toLowerCase();
        return lower.includes("date") || lower.includes("time");
      });
      if (likelyDateCol) setDateColumn(likelyDateCol);
    },
    []
  );

  const handleClearData = useCallback(() => {
    setCsvData([]);
    setColumns([]);
    setFileName("");
    setDateColumn("");
    setSegmentColumn("");
    setDependentVariable("");
    setSegments([]);
    setForecastResults(null);
  }, []);

  // Navigation helpers
  const canProceed = (step: WorkflowStep): boolean => {
    switch (step) {
      case "upload":
        return csvData.length > 0;
      case "model":
        return !!selectedModel;
      case "variables":
        return !!dateColumn && !!dependentVariable;
      case "segments":
        return segments.length > 0;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    const currentIndex = workflowSteps.findIndex((s) => s.id === activeTab);
    if (currentIndex < workflowSteps.length - 1) {
      setActiveTab(workflowSteps[currentIndex + 1].id);
    }
  };

  // Run forecast (mock implementation)
  const runForecast = async () => {
    setIsRunning(true);
    setActiveTab("results");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock results
    const mockResults: ForecastResultsType = {
      timestamp: new Date().toISOString(),
      modelType: selectedModel,
      segmentResults: segments.map((segment) => ({
        segmentName: segment.segmentName,
        frequency: segment.frequency,
        forecastData: Array.from({ length: 50 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 50 + i);
          const baseValue = 100 + Math.sin(i / 5) * 20;
          const noise = Math.random() * 10 - 5;
          return {
            date: date.toISOString(),
            actual: i < 40 ? baseValue + noise : null,
            predicted: baseValue,
            lowerBound: baseValue - 15,
            upperBound: baseValue + 15,
            isForecast: i >= 40,
            isTestSet: i >= 30 && i < 40,
          };
        }),
        metrics: selectedMetrics.map((metric) => ({
          metric,
          trainValue: Math.random() * 10,
          testValue: Math.random() * 15,
        })),
        transformationsApplied: [],
        modelConfig: { model: selectedModel },
        trainStartDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        trainEndDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        testStartDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        testEndDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        forecastStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        forecastEndDate: new Date().toISOString(),
        aiCommentary:
          "The model shows good fit to the training data with minimal overfitting. Seasonality patterns are well captured.",
      })),
    };

    setForecastResults(mockResults);
    setIsRunning(false);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">Prophet-Tune</h1>
                  <p className="text-sm text-muted-foreground">
                    Time Series Forecasting Platform
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as WorkflowStep)}>
            {/* Step Navigation */}
            <div className="mb-6 overflow-x-auto">
              <TabsList className="inline-flex h-auto p-1 gap-1">
                {workflowSteps.map((step, index) => {
                  const isPast = workflowSteps.findIndex((s) => s.id === activeTab) > index;
                  const isCurrent = step.id === activeTab;

                  return (
                    <TabsTrigger
                      key={step.id}
                      value={step.id}
                      disabled={index > 0 && !canProceed(workflowSteps[index - 1].id)}
                      className="relative px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <Badge
                          variant={isCurrent ? "default" : isPast ? "secondary" : "outline"}
                          className="h-5 w-5 p-0 justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <span className="hidden sm:inline">{step.shortLabel}</span>
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Upload */}
              <TabsContent value="upload" className="mt-0">
                <DataUpload
                  onDataLoaded={handleDataLoaded}
                  isLoaded={csvData.length > 0}
                  fileName={fileName}
                  onClear={handleClearData}
                />
                {csvData.length > 0 && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={goToNextStep}>
                      Continue to Model Selection
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Step 2: Model Selection */}
              <TabsContent value="model" className="mt-0">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={goToNextStep}>Continue to Variables</Button>
                </div>
              </TabsContent>

              {/* Step 3: Variable Configuration */}
              <TabsContent value="variables" className="mt-0">
                <VariableConfig
                  columns={columns}
                  dateColumn={dateColumn}
                  segmentColumn={segmentColumn}
                  dependentVariable={dependentVariable}
                  onDateColumnChange={setDateColumn}
                  onSegmentColumnChange={setSegmentColumn}
                  onDependentVariableChange={setDependentVariable}
                  data={csvData}
                />
                {dateColumn && dependentVariable && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={goToNextStep}>Continue to Segments</Button>
                  </div>
                )}
              </TabsContent>

              {/* Step 4: Segment Mapping */}
              <TabsContent value="segments" className="mt-0">
                <SegmentMapper
                  data={csvData}
                  dateColumn={dateColumn}
                  segmentColumn={segmentColumn}
                  segments={segments}
                  onSegmentsChange={setSegments}
                />
                {segments.length > 0 && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={goToNextStep}>Continue to Analysis</Button>
                  </div>
                )}
              </TabsContent>

              {/* Step 5: Data Analysis (Placeholder) */}
              <TabsContent value="analysis" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Analysis</CardTitle>
                    <CardDescription>
                      AI-powered transformation recommendations (coming soon)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This step will analyze your data and recommend transformations
                      to improve forecast accuracy.
                    </p>
                  </CardContent>
                </Card>
                <div className="flex justify-end mt-4">
                  <Button onClick={goToNextStep}>Continue to Regressors</Button>
                </div>
              </TabsContent>

              {/* Step 6: Regressors (Placeholder) */}
              <TabsContent value="regressors" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>External Regressors</CardTitle>
                    <CardDescription>
                      Configure additional variables to improve forecasts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Select columns to use as external regressors for your forecast model.
                    </p>
                  </CardContent>
                </Card>
                <div className="flex justify-end mt-4">
                  <Button onClick={goToNextStep}>Continue to Metrics</Button>
                </div>
              </TabsContent>

              {/* Step 7: Metrics Selection */}
              <TabsContent value="metrics" className="mt-0">
                <MetricsSelector
                  selectedMetrics={selectedMetrics}
                  onMetricsChange={setSelectedMetrics}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={goToNextStep}>Continue to Parameters</Button>
                </div>
              </TabsContent>

              {/* Step 8: Parameters */}
              <TabsContent value="parameters" className="mt-0">
                {selectedModel === "prophet" && (
                  <ProphetHyperparameters
                    parameters={prophetParams}
                    onParametersChange={setProphetParams}
                  />
                )}
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="default" onClick={runForecast} disabled={isRunning}>
                    <Play className="h-4 w-4 mr-1" />
                    Run Forecast
                  </Button>
                </div>
              </TabsContent>

              {/* Step 9: Results */}
              <TabsContent value="results" className="mt-0">
                {isRunning ? (
                  <ForecastProgress
                    segments={segments.map((s) => ({
                      segmentName: s.segmentName,
                      status: "processing",
                    }))}
                    overallProgress={50}
                    currentStep="Running forecast model..."
                  />
                ) : forecastResults ? (
                  <ForecastResults results={forecastResults} />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No forecast results yet. Complete the configuration and run the forecast.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Index;
ENDOFFILE

cat > src/pages/Auth.tsx << 'ENDOFFILE'
import React, { useState } from "react";
import { TrendingUp, Mail, Lock, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthProps {
  onAuthSuccess?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up form state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!signInEmail || !signInPassword) {
        throw new Error("Please enter both email and password");
      }

      // Success - would normally integrate with Supabase here
      onAuthSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!signUpEmail || !signUpPassword) {
        throw new Error("Please fill in all fields");
      }

      if (signUpPassword !== signUpConfirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (signUpPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success
      onAuthSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <TrendingUp className="h-10 w-10 text-primary" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Prophet-Tune</h1>
            <p className="text-sm text-muted-foreground">Time Series Forecasting</p>
          </div>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-9"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-9"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-9"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
ENDOFFILE

cat > src/pages/NotFound.tsx << 'ENDOFFILE'
import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
ENDOFFILE

echo "Creating UI components..."

# ============================================
# UI COMPONENTS
# ============================================

cat > src/components/ui/button.tsx << 'ENDOFFILE'
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
ENDOFFILE

cat > src/components/ui/label.tsx << 'ENDOFFILE'
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
ENDOFFILE

cat > src/components/ui/input.tsx << 'ENDOFFILE'
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
ENDOFFILE

cat > src/components/ui/card.tsx << 'ENDOFFILE'
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
ENDOFFILE

echo "Script is too long. Creating part 2..."

echo ""
echo "============================================"
echo "NOTE: Due to script length limits, some"
echo "UI components need to be created manually."
echo "Run: bash create-project-part2.sh"
echo "============================================"

echo ""
echo "Project structure created!"
echo "Next steps:"
echo "1. Run: bash create-project-part2.sh"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
#!/bin/bash

# Prophet-Tune Project Generator - Part 2
# Run this after create-project.sh

set -e

echo "Creating remaining UI components..."

cat > src/components/ui/tabs.tsx << 'ENDOFFILE'
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
ENDOFFILE

cat > src/components/ui/select.tsx << 'ENDOFFILE'
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
ENDOFFILE

cat > src/components/ui/checkbox.tsx << 'ENDOFFILE'
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
ENDOFFILE

cat > src/components/ui/radio-group.tsx << 'ENDOFFILE'
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
ENDOFFILE

cat > src/components/ui/switch.tsx << 'ENDOFFILE'
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
ENDOFFILE

cat > src/components/ui/slider.tsx << 'ENDOFFILE'
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
ENDOFFILE

cat > src/components/ui/progress.tsx << 'ENDOFFILE'
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
ENDOFFILE

cat > src/components/ui/table.tsx << 'ENDOFFILE'
import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
ENDOFFILE

cat > src/components/ui/badge.tsx << 'ENDOFFILE'
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
ENDOFFILE

cat > src/components/ui/tooltip.tsx << 'ENDOFFILE'
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
ENDOFFILE

cat > src/components/ui/separator.tsx << 'ENDOFFILE'
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
ENDOFFILE

cat > src/components/ui/scroll-area.tsx << 'ENDOFFILE'
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
ENDOFFILE

cat > src/components/ui/alert.tsx << 'ENDOFFILE'
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
ENDOFFILE

cat > src/components/ui/toast.tsx << 'ENDOFFILE'
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold [&+div]:text-xs", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
ENDOFFILE

echo "Creating forecast components..."

# Continue in part 3 for forecast components
echo ""
echo "UI components created!"
echo "Run: bash create-project-part3.sh for forecast components"
#!/bin/bash

# Prophet-Tune Project Generator - Part 3
# Forecast Components

set -e

echo "Creating forecast components..."

cat > src/components/forecast/DataUpload.tsx << 'ENDOFFILE'
import React, { useCallback, useState } from "react";
import Papa from "papaparse";
import { Upload, FileSpreadsheet, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataUploadProps {
  onDataLoaded: (data: Record<string, unknown>[], columns: string[]) => void;
  isLoaded: boolean;
  fileName?: string;
  onClear?: () => void;
}

const DataUpload: React.FC<DataUploadProps> = ({
  onDataLoaded,
  isLoaded,
  fileName,
  onClear,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      setError(null);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setIsLoading(false);
          if (results.errors.length > 0) {
            setError(`Parse error: ${results.errors[0].message}`);
            return;
          }
          const data = results.data as Record<string, unknown>[];
          const columns = results.meta.fields || [];
          if (data.length === 0) {
            setError("The file appears to be empty");
            return;
          }
          onDataLoaded(data, columns);
        },
        error: (err) => {
          setIsLoading(false);
          setError(`Failed to parse file: ${err.message}`);
        },
      });
    },
    [onDataLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) {
        processFile(file);
      } else {
        setError("Please upload a CSV file");
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  if (isLoaded && fileName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Data Loaded
          </CardTitle>
          <CardDescription>Your CSV file has been successfully loaded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-muted-foreground">Ready for configuration</p>
              </div>
            </div>
            {onClear && (
              <Button variant="outline" size="sm" onClick={onClear}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Data</CardTitle>
        <CardDescription>
          Upload a CSV file containing your time series data. The file should include a date column
          and at least one numeric column for forecasting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
            isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            isLoading && "opacity-50 pointer-events-none"
          )}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
            disabled={isLoading}
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isLoading ? "Processing..." : "Drop your CSV file here"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <Button variant="outline" disabled={isLoading} asChild>
              <span>Select File</span>
            </Button>
          </label>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataUpload;
ENDOFFILE

cat > src/components/forecast/ModelSelector.tsx << 'ENDOFFILE'
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
ENDOFFILE

cat > src/components/forecast/VariableConfig.tsx << 'ENDOFFILE'
import React, { useMemo } from "react";
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

  const numericColumns = useMemo(() => {
    if (data.length === 0) return columns;
    return columns.filter((col) => {
      const sampleValue = data[0][col];
      return typeof sampleValue === "number" || !isNaN(Number(sampleValue));
    });
  }, [columns, data]);

  const availableSegmentColumns = useMemo(() => {
    return columns.filter(
      (col) => col !== dateColumn && col !== dependentVariable
    );
  }, [columns, dateColumn, dependentVariable]);

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
ENDOFFILE

cat > src/components/forecast/SegmentMapper.tsx << 'ENDOFFILE'
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
  void _dateColumn;
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
ENDOFFILE

echo "Creating more forecast components..."
echo "Run: bash create-project-part4.sh"
#!/bin/bash

# Prophet-Tune Project Generator - Part 4
# Remaining Forecast Components

set -e

echo "Creating remaining forecast components..."

cat > src/components/forecast/ProphetHyperparameters.tsx << 'ENDOFFILE'
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
ENDOFFILE

cat > src/components/forecast/MetricsSelector.tsx << 'ENDOFFILE'
import React from "react";
import { BarChart3, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { PerformanceMetric } from "@/types/forecast";
import { metricNames } from "@/types/forecast";

interface MetricsSelectorProps {
  selectedMetrics: PerformanceMetric[];
  onMetricsChange: (metrics: PerformanceMetric[]) => void;
}

interface MetricInfo {
  metric: PerformanceMetric;
  description: string;
  formula: string;
  bestFor: string;
}

const metricsInfo: MetricInfo[] = [
  {
    metric: "mae",
    description: "Average absolute difference between predicted and actual values",
    formula: "MAE = (1/n) * |yi - pi|",
    bestFor: "Easy to interpret, same units as data",
  },
  {
    metric: "rmse",
    description: "Square root of the average squared differences",
    formula: "RMSE = ((1/n) * (yi - pi))^0.5",
    bestFor: "Penalizes large errors more heavily",
  },
  {
    metric: "mape",
    description: "Average percentage difference from actual values",
    formula: "MAPE = (100/n) * |yi - pi|/|yi|",
    bestFor: "Scale-independent comparison",
  },
  {
    metric: "smape",
    description: "Symmetric version of MAPE",
    formula: "SMAPE = (100/n) * |yi - pi|/((|yi| + |pi|)/2)",
    bestFor: "Handles zero values better than MAPE",
  },
  {
    metric: "mse",
    description: "Average of squared differences",
    formula: "MSE = (1/n) * (yi - pi)",
    bestFor: "Mathematical convenience, used in optimization",
  },
  {
    metric: "r_squared",
    description: "Proportion of variance explained by the model",
    formula: "R = 1 - SS_res/SS_tot",
    bestFor: "Understanding model fit quality",
  },
  {
    metric: "adjusted_r_squared",
    description: "R-squared adjusted for number of predictors",
    formula: "Adj R = 1 - (1-R)(n-1)/(n-p-1)",
    bestFor: "Comparing models with different features",
  },
  {
    metric: "coverage",
    description: "Percentage of actual values within prediction intervals",
    formula: "Coverage = count(yi in [lo, hi]) / n",
    bestFor: "Evaluating uncertainty estimates",
  },
  {
    metric: "mase",
    description: "Scaled error relative to naive forecast",
    formula: "MASE = MAE / MAE_naive",
    bestFor: "Cross-series comparison",
  },
];

const MetricsSelector: React.FC<MetricsSelectorProps> = ({
  selectedMetrics,
  onMetricsChange,
}) => {
  const toggleMetric = (metric: PerformanceMetric) => {
    if (selectedMetrics.includes(metric)) {
      onMetricsChange(selectedMetrics.filter((m) => m !== metric));
    } else {
      onMetricsChange([...selectedMetrics, metric]);
    }
  };

  const selectAll = () => {
    onMetricsChange(metricsInfo.map((m) => m.metric));
  };

  const selectNone = () => {
    onMetricsChange([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
        <CardDescription>
          Select the metrics to calculate for evaluating forecast accuracy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <button
            onClick={selectAll}
            className="text-sm text-primary hover:underline"
          >
            Select All
          </button>
          <button
            onClick={selectNone}
            className="text-sm text-muted-foreground hover:underline"
          >
            Clear All
          </button>
        </div>

        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricsInfo.map(({ metric, description, formula, bestFor }) => (
              <div
                key={metric}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer
                  ${selectedMetrics.includes(metric) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                onClick={() => toggleMetric(metric)}
              >
                <Checkbox
                  id={metric}
                  checked={selectedMetrics.includes(metric)}
                  onCheckedChange={() => toggleMetric(metric)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <Label htmlFor={metric} className="cursor-pointer font-medium">
                      {metricNames[metric]}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">{description}</p>
                          <p className="text-xs font-mono">{formula}</p>
                          <p className="text-xs text-muted-foreground">Best for: {bestFor}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="font-medium">{selectedMetrics.length}</span> metrics selected
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsSelector;
ENDOFFILE

cat > src/components/forecast/ForecastProgress.tsx << 'ENDOFFILE'
import React from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SegmentProgress {
  segmentName: string;
  status: "pending" | "processing" | "completed" | "error";
  message?: string;
}

interface ForecastProgressProps {
  segments: SegmentProgress[];
  overallProgress: number;
  currentStep?: string;
}

const ForecastProgress: React.FC<ForecastProgressProps> = ({
  segments,
  overallProgress,
  currentStep,
}) => {
  const completedCount = segments.filter((s) => s.status === "completed").length;
  const errorCount = segments.filter((s) => s.status === "error").length;

  const getStatusIcon = (status: SegmentProgress["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  const getStatusBadge = (status: SegmentProgress["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "processing":
        return <Badge variant="default">Processing</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Running Forecast
        </CardTitle>
        <CardDescription>
          {currentStep || `Processing ${segments.length} segment(s)...`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>{completedCount} completed</span>
            {errorCount > 0 && (
              <span className="text-destructive">{errorCount} failed</span>
            )}
            <span>{segments.length - completedCount - errorCount} remaining</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Segment Status</h4>
          <div className="rounded-lg border divide-y">
            {segments.map((segment) => (
              <div
                key={segment.segmentName}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(segment.status)}
                  <div>
                    <p className="font-medium text-sm">{segment.segmentName}</p>
                    {segment.message && (
                      <p className="text-xs text-muted-foreground">{segment.message}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(segment.status)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastProgress;
ENDOFFILE

cat > src/components/forecast/ForecastResults.tsx << 'ENDOFFILE'
import React, { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { Download, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ForecastResults as ForecastResultsType } from "@/types/forecastResults";
import { metricNames } from "@/types/forecast";

interface ForecastResultsProps {
  results: ForecastResultsType;
  onExport?: (format: "csv" | "json") => void;
}

const ForecastResults: React.FC<ForecastResultsProps> = ({ results, onExport }) => {
  const [selectedSegment, setSelectedSegment] = useState<string>(
    results.segmentResults[0]?.segmentName || ""
  );

  const currentSegmentResult = results.segmentResults.find(
    (r) => r.segmentName === selectedSegment
  );

  const formatNumber = (num: number | null, decimals = 2): string => {
    if (num === null || num === undefined) return "N/A";
    return num.toFixed(decimals);
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  if (!currentSegmentResult) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No forecast results available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = currentSegmentResult.forecastData.map((point) => ({
    date: formatDate(point.date),
    actual: point.actual,
    predicted: point.predicted,
    lower: point.lowerBound,
    upper: point.upperBound,
    isForecast: point.isForecast,
    isTest: point.isTestSet,
  }));

  const testStartIndex = chartData.findIndex((d) => d.isTest);
  const forecastStartIndex = chartData.findIndex((d) => d.isForecast);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Forecast Results
            </CardTitle>
            <CardDescription>
              Generated on {new Date(results.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {results.segmentResults.length > 1 && (
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  {results.segmentResults.map((result) => (
                    <SelectItem key={result.segmentName} value={result.segmentName}>
                      {result.segmentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={() => onExport("csv")}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="mt-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="none"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    name="Upper Bound"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="none"
                    fill="hsl(var(--background))"
                    fillOpacity={1}
                    name="Lower Bound"
                  />

                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={false}
                    name="Actual"
                  />

                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Predicted"
                  />

                  {testStartIndex > 0 && (
                    <ReferenceLine
                      x={chartData[testStartIndex]?.date}
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="3 3"
                      label={{ value: "Test Start", position: "top", fontSize: 10 }}
                    />
                  )}
                  {forecastStartIndex > 0 && (
                    <ReferenceLine
                      x={chartData[forecastStartIndex]?.date}
                      stroke="hsl(var(--primary))"
                      strokeDasharray="3 3"
                      label={{ value: "Forecast Start", position: "top", fontSize: 10 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-4 mt-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-foreground"></div>
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-primary" style={{ borderStyle: "dashed" }}></div>
                <span>Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/10 rounded"></div>
                <span>Confidence Interval</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Training Set</TableHead>
                    <TableHead className="text-right">Test Set</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSegmentResult.metrics.map((m) => (
                    <TableRow key={m.metric}>
                      <TableCell className="font-medium">
                        {metricNames[m.metric]}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {m.metric.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(m.trainValue)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(m.testValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {currentSegmentResult.aiCommentary && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">{currentSegmentResult.aiCommentary}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <div className="max-h-[400px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Predicted</TableHead>
                    <TableHead className="text-right">Lower</TableHead>
                    <TableHead className="text-right">Upper</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSegmentResult.forecastData.map((point, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{formatDate(point.date)}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(point.actual)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(point.predicted)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {formatNumber(point.lowerBound)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {formatNumber(point.upperBound)}
                      </TableCell>
                      <TableCell className="text-center">
                        {point.isForecast ? (
                          <Badge>Forecast</Badge>
                        ) : point.isTestSet ? (
                          <Badge variant="secondary">Test</Badge>
                        ) : (
                          <Badge variant="outline">Train</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ForecastResults;
ENDOFFILE

echo ""
echo "============================================"
echo "All files created successfully!"
echo "============================================"
echo ""
echo "To set up the project:"
echo "1. cd to project directory"
echo "2. npm install"
echo "3. npm run dev"
echo ""
echo "The app will run at http://localhost:5173"
