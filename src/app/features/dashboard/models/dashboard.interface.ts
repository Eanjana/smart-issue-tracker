// -- summary card data -----

export interface SummaryCardData {
    label: string;  // total issues, open issues etc
    value: number;  //current count
    icon: string;   //font awesome icon
    color: 'teal' | 'blue' | 'orange' | 'red' | 'green';
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

// -- SLA Metrics data ---

export interface SLAMetric {
    label: string;  // eg. "Average Resolution Time"
    value: string;  // eg. "2.4 hours"
    target?: string;  //eg. "target - 4 hours"
    percentage: number; // progress % (0 - 100)
    status: 'good' | 'warning' | 'critical'; // visual indicator
}



// -- chart data ---

export interface ChartDataPoint {
    label: string;  // eg. "Jan", "feb", "Critical" etc.
    value: number;  // eg. count or metric value
    color?: string;  // optional bar color for charts
}

export interface ChartConfig {
  title: string;
  type: 'bar' | 'line' | 'pie';
  data: ChartDataPoint[];
  description?: string;
}


// (used by dashboard service + worker)
// ------------ Web Worker Result Type ------------------
export interface DashboardAnalyticsResult {
  summaryCards: SummaryCardData[];
  slaMetrics: SLAMetric[];
  issuesByStatus: ChartConfig;
  issuesByPriority: ChartConfig;
  issuesByMonth: ChartConfig;
}