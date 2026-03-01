import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IssueInterface } from '../../models/issue.interface';
import { CommonModule } from '@angular/common';

/**
 * @description Kanban board component. Splits the issues input
 * into three computed columns: open, in-progress, resolved.
 * @author Anjana E
 * @date 01-03-2026
 */

@Component({
  selector: 'app-issue-kanban',
  imports: [CommonModule],
  templateUrl: './issue-kanban.html',
  styleUrl: './issue-kanban.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueKanban {
  //input signal
  issues = input<IssueInterface[]>([]);

  //-----kanban columns-----
  openIssues = computed(() => this.issues().filter((issue) => issue.status === 'open'));

  inProgressIssues = computed(() =>
    this.issues().filter((issue) => issue.status === 'in-progress'),
  );

  resolvedIssues = computed(() => this.issues().filter((issue) => issue.status === 'resolved'));

  //format  date
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
