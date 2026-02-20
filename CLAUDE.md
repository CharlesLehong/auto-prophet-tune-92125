# Prophet-Tune: Time Series Forecasting Platform

## Project Overview

Prophet-Tune is a professional-grade web application for advanced time series forecasting and model analysis. It enables users to configure and run Prophet and AutoGluon forecasting models with sophisticated hyperparameter tuning, data transformation analysis, and multi-segment forecasting with performance metrics.

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for builds and HMR
- **Tailwind CSS** for styling
- **shadcn-ui** component library (Radix UI based)
- **React Router 6** for routing
- **React Hook Form + Zod** for form validation
- **Recharts** for data visualization
- **TanStack React Query** for server state
- **PapaParse** for CSV parsing
- **Sonner** for toast notifications

### Backend
- **Supabase** for auth, database, and edge functions

## Project Structure

```
src/
├── App.tsx                    # Main app with routing
├── main.tsx                   # React entry point
├── pages/
│   ├── Index.tsx              # Main forecasting dashboard (9-step workflow)
│   ├── Auth.tsx               # Authentication page
│   └── NotFound.tsx           # 404 page
├── components/
│   ├── ui/                    # shadcn-ui base components
│   └── forecast/              # Domain-specific components
│       ├── DataUpload.tsx     # CSV file upload
│       ├── ModelSelector.tsx  # Model selection
│       ├── VariableConfig.tsx # Column configuration
│       ├── SegmentMapper.tsx  # Segment configuration
│       ├── ProphetHyperparameters.tsx  # Parameter tuning
│       ├── MetricsSelector.tsx # Metrics selection
│       ├── ForecastResults.tsx # Results visualization
│       └── ForecastProgress.tsx # Progress tracking
├── types/
│   ├── forecast.ts            # Core type definitions
│   ├── forecastResults.ts     # Result data structures
│   └── dataAnalysis.ts        # Analysis types
├── utils/
│   └── dataAnalysis.ts        # Data processing utilities
├── hooks/                     # Custom React hooks
├── lib/
│   └── utils.ts               # General utilities
└── integrations/
    └── supabase/              # Supabase client and types
```

## Key Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Application Workflow (9 Steps)

1. **Upload** - CSV file upload with drag-and-drop
2. **Model Selection** - Choose Prophet or AutoGluon
3. **Variable Config** - Select date, segment, dependent variable columns
4. **Segment Mapping** - Configure train/test splits per segment
5. **Data Analysis** - AI-recommended transformations (optional)
6. **Regressor Config** - Configure external variables
7. **Metrics Selection** - Choose performance metrics
8. **Parameter Tuning** - Prophet hyperparameters
9. **Results** - View forecasts, metrics, and export

## Key Types

```typescript
type ForecastModel = 'prophet' | 'autogluon' | 'arima' | 'ar' | 'arma';

type PerformanceMetric = 'mae' | 'rmse' | 'mape' | 'mse' | 'r_squared' |
                         'adjusted_r_squared' | 'coverage' | 'smape' | 'mase';

type DataFrequency = 'D' | 'W' | 'MS' | 'QS' | 'YS';
```

## Code Patterns

### Component Structure
- Props interface defined at top
- Main component as default export
- shadcn-ui components for UI primitives
- Tailwind classes for styling

### State Management
- Local state (useState) for UI state
- React Query for server state

### Error Handling
- Toast notifications via Sonner
- Form validation with Zod schemas

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<supabase-anon-key>
```
