import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme-service/theme.service';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { SummaryCards } from '../../components/summary-cards/summary-cards';
import { SlaMetrics } from '../../components/sla-metrics/sla-metrics';
import { IssueChart } from '../../components/issue-chart/issue-chart';

/**
 * @description  Main dashboard page. Displays summary cards,
 * SLA metrics, and D3 charts sourced from DashboardService signals.
 * @author Anjana E
 * @date 01-03-2026
 */

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SummaryCards, SlaMetrics, IssueChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  //services
  private dashboardService = inject(DashboardService);
  private themeService = inject(ThemeService);

  //theme toggle label
  readonly themeLabel = this.themeService.themeLabel;

  summaryCards = this.dashboardService.summaryCards;
  slaMetrics = this.dashboardService.slaMetrics;
  chartByPriority = this.dashboardService.issuesByPriorityConfig;
  chartByStatus = this.dashboardService.issuesByStatusConfig;
  chartByMonth = this.dashboardService.issuesByMonthConfig;

  // toggle theme
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
