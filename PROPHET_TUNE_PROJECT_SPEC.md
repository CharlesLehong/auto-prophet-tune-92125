# Prophet-Tune Project Specification

## Overview
Create a complete Prophet-Tune time series forecasting web application from scratch.

## Tech Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4 with CSS variables for theming
- **UI Components**: shadcn-ui (built on Radix UI primitives)
- **Charts**: Recharts
- **Backend**: Supabase (auth, database, edge functions)
- **State Management**: TanStack React Query
- **Routing**: React Router DOM 7
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toast library

## Project Structure
```
prophet-tune/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json, tsconfig.app.json, tsconfig.node.json
├── postcss.config.js
├── eslint.config.js
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx (with React Query provider, Router, Toaster)
    ├── index.css (Tailwind + CSS variables for light/dark themes)
    ├── lib/utils.ts (cn helper using clsx + tailwind-merge)
    ├── types/
    │   ├── forecast.ts (ForecastModel, DataFrequency, PerformanceMetric, configs)
    │   ├── forecastResults.ts (ForecastPoint, MetricsResult, SegmentForecastResult)
    │   └── dataAnalysis.ts (stationarity tests, autocorrelation, transformations)
    ├── hooks/
    │   ├── useToast.ts (wrapper around sonner)
    │   └── useMobile.ts (responsive breakpoint hook)
    ├── utils/
    │   └── dataAnalysis.ts (metric calculations: MAE, RMSE, MAPE, R-squared, etc.)
    ├── integrations/supabase/
    │   ├── client.ts (Supabase client setup)
    │   └── types.ts (Database types)
    ├── pages/
    │   ├── Index.tsx (main 9-step workflow page)
    │   ├── Auth.tsx (sign in/sign up forms)
    │   └── NotFound.tsx (404 page)
    └── components/
        ├── ui/ (18 shadcn-style components)
        │   ├── button.tsx, label.tsx, input.tsx, card.tsx
        │   ├── tabs.tsx, select.tsx, checkbox.tsx, radio-group.tsx
        │   ├── switch.tsx, slider.tsx, progress.tsx, table.tsx
        │   ├── badge.tsx, tooltip.tsx, separator.tsx, scroll-area.tsx
        │   ├── alert.tsx, toast.tsx
        └── forecast/ (8 workflow components)
            ├── DataUpload.tsx (CSV upload with drag-drop, PapaParse)
            ├── ModelSelector.tsx (Prophet, AutoGluon, ARIMA, AR, ARMA)
            ├── VariableConfig.tsx (date, segment, dependent variable selection)
            ├── SegmentMapper.tsx (configure per-segment settings)
            ├── ProphetHyperparameters.tsx (growth, changepoints, seasonality, uncertainty)
            ├── MetricsSelector.tsx (MAE, RMSE, MAPE, SMAPE, MSE, R-squared, coverage, MASE)
            ├── ForecastProgress.tsx (progress indicator during forecast)
            └── ForecastResults.tsx (charts with Recharts, metrics table, export)
```

## 9-Step Workflow
1. **Upload Data** - CSV file upload with preview
2. **Select Model** - Choose forecasting model (Prophet default)
3. **Configure Variables** - Set date column, segment column, dependent variable
4. **Segment Mapping** - Configure train/test split, forecast periods per segment
5. **Data Analysis** - AI-powered transformation recommendations (placeholder)
6. **Regressors** - External regressor configuration (placeholder)
7. **Metrics** - Select performance metrics to calculate
8. **Parameters** - Model-specific hyperparameters (Prophet: growth, seasonality, etc.)
9. **Results** - Interactive charts, metrics table, export options

## Key Features
- Drag-and-drop CSV upload with data preview
- Multi-segment forecasting support
- Prophet hyperparameter configuration UI with sliders
- Interactive forecast charts with confidence intervals
- Train/test split visualization
- Performance metrics comparison
- Dark/light theme support via CSS variables
- Mobile-responsive design

## Dependencies (package.json)
Key dependencies:
- @radix-ui/* components (accordion, checkbox, dialog, dropdown-menu, label, popover, progress, radio-group, scroll-area, select, separator, slider, slot, switch, tabs, toast, toggle, tooltip)
- @supabase/supabase-js
- @tanstack/react-query
- class-variance-authority
- clsx, tailwind-merge
- date-fns
- lucide-react (icons)
- papaparse (CSV parsing)
- react, react-dom, react-router-dom
- react-hook-form, @hookform/resolvers, zod
- recharts
- sonner
- tailwindcss-animate

## Instructions for New Chat
When asked to create this project, generate a complete, working React application with all the files listed above. Use the shadcn-ui component patterns (Radix primitives with CVA styling). Include mock forecast functionality that generates sample data for demonstration.
