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
