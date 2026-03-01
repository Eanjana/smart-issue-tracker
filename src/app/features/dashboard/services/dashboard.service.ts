import { Injectable, OnDestroy, effect, inject, signal } from '@angular/core';
import {
  ChartConfig,
  DashboardAnalyticsResult,
  SLAMetric,
  SummaryCardData,
} from '../models/dashboard.interface';
import { IssueService } from '../../issues/services/issue.service';

/**
 * @description  Orchestrates dashboard analytics by passing
 * issue data to a Web Worker and exposing computed results
 * as signals for the dashboard UI.
 * @author Anjana E
 * @date 01-03-2026
 */

@Injectable({
  providedIn: 'root',
})
export class DashboardService implements OnDestroy {
  private issueService = inject(IssueService);

  // issues from IssueService
  issues = this.issueService.issues;

  // ------------------------------
  // Worker
  // ------------------------------
  private worker = new Worker(
    new URL('../../../core/workers/analytics.worker.ts', import.meta.url),
    { type: 'module' },
  );

  // ------------------------------
  // Signals for UI
  // ------------------------------
  summaryCards = signal<SummaryCardData[]>([]);
  slaMetrics = signal<SLAMetric[]>([]);
  issuesByStatusConfig = signal<ChartConfig | null>(null);
  issuesByPriorityConfig = signal<ChartConfig | null>(null);
  issuesByMonthConfig = signal<ChartConfig | null>(null);

  constructor() {
    //listen worker result
    this.worker.onmessage = ({ data }: MessageEvent<DashboardAnalyticsResult>) => {
      this.summaryCards.set(data.summaryCards);
      this.slaMetrics.set(data.slaMetrics);
      this.issuesByStatusConfig.set(data.issuesByStatus);
      this.issuesByPriorityConfig.set(data.issuesByPriority);
      this.issuesByMonthConfig.set(data.issuesByMonth);
    };

    // Send issues to worker whenever they change
    effect(() => {
      const issues = this.issues();

      // prevent useless worker runs
      if (!issues.length) return;

      this.worker.postMessage(issues);
    });
  }

  //Prevents accidental double termination if Angular reloads modules
  private destroyed = false;

  //terminate the worker when the app is destroyed
  ngOnDestroy() {
    if (!this.destroyed) {
      this.worker.terminate();
      this.destroyed = true;
    }
  }
}
