/// <reference lib="webworker" />

import {
  ChartConfig,
  DashboardAnalyticsResult,
  SLAMetric,
  SummaryCardData,
} from '../../features/dashboard/models/dashboard.interface';
import { IssueInterface } from '../../features/issues/models/issue.interface';

/**
 * @description Web Worker for heavy dashboard analytics.
 * Receives the full issues array, computes summary counts,
 * SLA metrics, and chart data off the main thread, then
 * posts the result back to DashboardService.
 * @author Anjana E
 * @date 01-03-2026
 */

// Worker receives issues
addEventListener('message', ({ data }) => {
  const issues: IssueInterface[] = data;

  const now = Date.now();

  // ------------------------------
  // Counters
  // ------------------------------
  let total = issues.length;
  let open = 0;
  let resolved = 0;
  let highPriority = 0;
  let overdue = 0;
  let onTrack = 0;
  let delayed = 0;

  // SLA
  let resolutionSum = 0;
  let resolvedCount = 0;

  //charts
  const statusMap: Record<'open' | 'in-progress' | 'resolved', number> = {
    open: 0,
    'in-progress': 0,
    resolved: 0,
  };

  const priorityMap: Record<'low' | 'medium' | 'high', number> = {
    low: 0,
    medium: 0,
    high: 0,
  };

  const months: Record<string, number> = {};

  // -------------------------------------
  // Process issues for dashboard analytics [ single loop ]
  // ---------------------------------------

  for (const issue of issues) {
    const status = issue.status;
    const priority = issue.priority;

    const createdAt = new Date(issue.createdAt).getTime();
    const dueDate = new Date(issue.dueDate).getTime();
    const resolvedAt = issue.resolvedAt ? new Date(issue.resolvedAt).getTime() : null;

    //status - will reflect the count in summary cards
    if (status === 'open') open++;
    if (status === 'resolved') resolved++;
    if (status === 'in-progress') onTrack++;

    statusMap[status]++;  //same status count applies to status chart

    //priority
    if (priority === 'high') highPriority++;
    priorityMap[priority]++;

    //overdue
    if (dueDate < now && status !== 'resolved') overdue++;

    //delayed - for SLA
    if (status === 'open' && dueDate < now) delayed++;

    //SLA resolution time
    if (status === 'resolved' && resolvedAt) {
      resolutionSum += (resolvedAt - createdAt) / 3600000;
      resolvedCount++;
    }

    //Month chart - to extract the month part from the dat ['jan'].
    const month = new Date(createdAt).toLocaleString('default', {
      month: 'short',
    });

    months[month] = (months[month] || 0) + 1; // total issues count per month
  }

  // ------------------------------
  // Average resolution
  // ------------------------------
  const avgResolution = resolvedCount > 0 ? resolutionSum / resolvedCount : 0;

  const totalIssues = total || 1;

  const resolutionPercentage = avgResolution === 0 ? 0 : Math.min((4 / avgResolution) * 100, 100);

  // ------------------------------
  // Summary Cards
  // ------------------------------
  const summaryCards: SummaryCardData[] = [
    //summary cards list on dashboard
    {
      label: 'Total Issues',
      value: total,
      icon: 'fa-solid fa-layer-group',
      color: 'blue',
      trend: { value: 0, direction: 'up' },
    },

    {
      label: 'Open Issues',
      value: open,
      icon: 'fa-solid fa-circle-exclamation',
      color: 'teal',
      trend: { value: 0, direction: 'up' },
    },

    {
      label: 'Resolved',
      value: resolved,
      icon: 'fa-solid fa-circle-check',
      color: 'green',
      trend: { value: 0, direction: 'down' },
    },

    {
      label: 'High Priority',
      value: highPriority,
      icon: 'fa-solid fa-triangle-exclamation',
      color: 'red',
      trend: { value: 0, direction: 'up' },
    },

    {
      label: 'Overdue',
      value: overdue,
      icon: 'fa-solid fa-clock',
      color: 'orange',
      trend: { value: 0, direction: 'up' },
    },
  ];

  // ------------------------------
  // SLA Metrics
  // ------------------------------
  const slaMetrics: SLAMetric[] = [
    {
      label: 'Average Resolution Time',
      value: `${avgResolution.toFixed(1)} hours`,
      target: 'Target: 4 hours',
      percentage: resolutionPercentage,
      status:
        avgResolution === 0
          ? 'good'
          : avgResolution <= 4
            ? 'good'
            : avgResolution <= 6
              ? 'warning'
              : 'critical',
    },
    {
      label: 'On Track',
      value: `${onTrack}`,
      percentage: (onTrack / totalIssues) * 100,
      status: 'good',
    },
    {
      label: 'Delayed',
      value: `${delayed}`,
      percentage: (delayed / totalIssues) * 100,
      status: delayed > 0 ? 'warning' : 'good',
    },
    {
      label: 'Breached SLA',
      value: `${overdue}`,
      percentage: (overdue / totalIssues) * 100,
      status: overdue === 0 ? 'good' : 'critical',
    },
  ];

  // ------------------------------
  // Charts
  // ------------------------------
  const issuesByStatus: ChartConfig = {
    title: 'issues by status',
    type: 'bar',
    data: [
      {
        label: 'open',
        value: statusMap.open,
        color: '#3b82f6',
      },
      { label: 'medium', value: statusMap['in-progress'], color: '#FFB84D' },
      { label: 'high', value: statusMap.resolved, color: 'var(--clr-teal-500)' },
    ],
  };

  const issuesByPriority: ChartConfig = {
    title: 'Issues by Priority',
    type: 'bar',
    data: [
      {
        label: 'low',
        value: priorityMap.low,
        color: 'var(--clr-teal-500)',
      },
      { label: 'medium', value: priorityMap.medium, color: '#FFB84D' },
      { label: 'high', value: priorityMap.high, color: '#FF5C7A' },
    ],
  };

  const issuesByMonth: ChartConfig = {
    title: 'Issues by Month',
    type: 'bar',
    // Convert the months object like { Jan: 5, Feb: 3 } into chart data array
    data: Object.entries(months).map(([label, value]) => ({
      label,
      value,
    })),
  };

  // ------------------------------
  // Final result
  // ------------------------------
  const result: DashboardAnalyticsResult = {
    summaryCards,
    slaMetrics,
    issuesByStatus,
    issuesByPriority,
    issuesByMonth,
  };

  postMessage(result);
});
