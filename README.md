# Prophet-Tune

A professional time series forecasting platform built with React, TypeScript, and Vite.

## Features

- **CSV Data Upload** - Drag-and-drop file upload with automatic column detection
- **Multi-Segment Forecasting** - Handle different time series segments independently
- **Multiple Models** - Prophet, AutoGluon, ARIMA support
- **Hyperparameter Tuning** - Advanced Prophet configuration
- **Performance Metrics** - MAE, RMSE, MAPE, R-squared, and more
- **Export Results** - Download forecasts in various formats

## 9-Step Workflow

1. **Upload** - Upload your time series CSV data
2. **Model** - Select forecasting model (Prophet/AutoGluon)
3. **Variables** - Configure date, segment, and target columns
4. **Segments** - Set up train/test splits and forecast periods
5. **Analysis** - AI-powered data analysis (coming soon)
6. **Regressors** - Configure external variables
7. **Metrics** - Select performance metrics to calculate
8. **Parameters** - Fine-tune model hyperparameters
9. **Results** - View forecasts, metrics, and export

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui
- **Charts**: Recharts
- **Routing**: React Router 6
- **State**: TanStack React Query
- **Backend**: Supabase (Auth, Database, Edge Functions)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## Project Structure

```
src/
├── pages/           # Route pages
├── components/
│   ├── ui/          # shadcn-ui components
│   └── forecast/    # Forecast-specific components
├── types/           # TypeScript definitions
├── utils/           # Utility functions
├── hooks/           # Custom React hooks
└── integrations/    # External service clients
```

## Claude Code Integration

This project includes Claude Code configuration:
- `CLAUDE.md` - Project documentation
- `.claude/commands/` - Custom slash commands

## License

Private project - All rights reserved.
