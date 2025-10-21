/**
 * Analyze time series data for a segment
 */
export const analyzeSegmentData = (
  data: any[],
  segmentColumn: string,
  segmentValue: string,
  dateColumn: string
) => {
  // Filter data for this segment
  const segmentData = data.filter(row => row[segmentColumn] === segmentValue);
  
  // Sort by date
  const sortedData = [...segmentData].sort((a, b) => {
    const dateA = new Date(a[dateColumn]).getTime();
    const dateB = new Date(b[dateColumn]).getTime();
    return dateA - dateB;
  });

  const totalRecords = sortedData.length;

  // Auto-detect frequency by analyzing time differences
  let detectedFrequency = 'MS'; // Default to monthly
  
  if (sortedData.length >= 2) {
    const dates = sortedData.map(row => new Date(row[dateColumn]));
    const differences: number[] = [];
    
    for (let i = 1; i < Math.min(10, dates.length); i++) {
      const diffDays = (dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60 * 24);
      differences.push(Math.round(diffDays));
    }
    
    const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
    
    // Determine frequency based on average difference
    if (avgDiff <= 1.5) {
      detectedFrequency = 'D'; // Daily
    } else if (avgDiff <= 8) {
      detectedFrequency = 'W'; // Weekly
    } else if (avgDiff <= 20) {
      detectedFrequency = 'SMS'; // Semi-monthly
    } else if (avgDiff <= 35) {
      detectedFrequency = 'MS'; // Monthly start
    } else if (avgDiff <= 100) {
      detectedFrequency = 'QS'; // Quarterly
    } else {
      detectedFrequency = 'YS'; // Yearly
    }
  }

  // Get date range
  const firstDate = sortedData.length > 0 ? new Date(sortedData[0][dateColumn]) : null;
  const lastDate = sortedData.length > 0 ? new Date(sortedData[sortedData.length - 1][dateColumn]) : null;

  return {
    totalRecords,
    detectedFrequency,
    firstDate,
    lastDate,
    sortedData,
  };
};

/**
 * Get frequency display name
 */
export const getFrequencyName = (freq: string): string => {
  const names: Record<string, string> = {
    'D': 'Daily',
    'W': 'Weekly',
    'SMS': 'Semi-Monthly',
    'MS': 'Monthly',
    'QS': 'Quarterly',
    'YS': 'Yearly',
  };
  return names[freq] || freq;
};

/**
 * Calculate months between dates
 */
export const calculateMonthsObservable = (
  firstDate: Date | null,
  lastDate: Date | null,
  frequency: string
): number => {
  if (!firstDate || !lastDate) return 0;
  
  const yearsDiff = lastDate.getFullYear() - firstDate.getFullYear();
  const monthsDiff = lastDate.getMonth() - firstDate.getMonth();
  
  return yearsDiff * 12 + monthsDiff + 1;
};
