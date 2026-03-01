import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IssueService } from '../../services/issue.service';
import { IssueInterface } from '../../models/issue.interface';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IssueTable } from '../../components/issue-table/issue-table';
import { IssueKanban } from '../../components/issue-kanban/issue-kanban';

/**
 * @description  Issue Management list page. Supports table and
 * kanban views with real-time filtering by status, priority,
 * and search text.
 * @author Anjana E
 * @date 01-03-2026
 */

@Component({
  selector: 'app-issue-list',
  imports: [CommonModule, RouterModule, IssueTable, IssueKanban],
  templateUrl: './issue-list.html',
  styleUrl: './issue-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueList {
  private issueService = inject(IssueService);
  private router = inject(Router);

  issues = this.issueService.issues;

  //search filter
  search = signal('');

  //filters
  filterStatus = signal<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  filterPriority = signal<'all' | 'low' | 'medium' | 'high'>('all');

  //view mode
  view = signal<'table' | 'kanban'>('table');

  //filtered issues
  filteredIssues = computed<IssueInterface[]>(() => {
    // read signal once
    const issues = this.issues();
    let list = issues;

    if (this.filterStatus() !== 'all') {
      list = list.filter((i) => i.status === this.filterStatus());
    }

    if (this.filterPriority() !== 'all') {
      list = list.filter((i) => i.priority === this.filterPriority());
    }

    if (this.search()) {
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(this.search().toLowerCase()) ||
          i.category.toLowerCase().includes(this.search().toLowerCase()),
      );
    }
    return list;
  });

  // ------delete issue-----
  deleteIssue(id: number) {
    this.issueService.deleteIssue(id);
  }

  // ------edit issue-----
  editIssue(issue: IssueInterface) {
    this.router.navigate(['/issues', issue.id, 'edit']);
  }

  //------create issue-----
  createIssue() {
    this.router.navigate(['/issue/new']);
  }
}
