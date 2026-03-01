import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { IssueInterface } from '../../models/issue.interface';
import { Router } from '@angular/router';

/**
 * @description Presentational table component. Receives issues
 * as input signal and emits edit/delete events to the parent.
 * @author Anjana E
 * @date 01-03-2026
 */

@Component({
  selector: 'app-issue-table',
  imports: [],
  templateUrl: './issue-table.html',
  styleUrl: './issue-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueTable {
  //receives issues
  issues = input<IssueInterface[]>([]);

  //router for navigating to issue details
  private router = inject(Router);

  //emits issue id back to handle
  editIssue = output<IssueInterface>();
  deleteIssue = output<number>();

  // Row click: view details
  viewIssue(issue: IssueInterface) {
    this.router.navigate(['/issues', issue.id]);
  }

  // Edit button click
  onEditClick(issue: IssueInterface, event: Event) {
    event.stopPropagation(); //to prevent row click to detail
    this.editIssue.emit(issue);
  }

  // delete button click
  onDeleteClick(id: number, event: Event) {
    event.stopPropagation();
    this.deleteIssue.emit(id);
  }

  // formats Date object -> day / month / year
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
