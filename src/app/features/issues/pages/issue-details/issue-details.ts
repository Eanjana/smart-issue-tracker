import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { IssueInterface } from '../../models/issue.interface';

/**
 * @description Issue detail view. Reads :id from route params
 * and finds the matching issue from the IssueService signal store.
 * @author Anjana E
 * @date 01-03-2026
 */

@Component({
  selector: 'app-issue-details',
  imports: [],
  templateUrl: './issue-details.html',
  styleUrl: './issue-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private issueService = inject(IssueService);

  //current issue data
  issue = signal<IssueInterface | null>(null);

  constructor() {
    effect(() => {
      //get id from route
      const idParam = this.route.snapshot.paramMap.get('id');

      if (!idParam) return;

      //convert string -> number
      const id = Number(idParam);

      //find issue from signal store
      const found = this.issueService.issues().find((i) => i.id === id) ?? null;

      this.issue.set(found);
    });
  }

  //go to edit page
  editIssue() {
    const current = this.issue();
    if (!current) return;

    this.router.navigate(['/issues', current.id, 'edit']);
  }

  //delete issue
  deleteIssue() {
    const current = this.issue();
    if (!current) return;

    this.issueService.deleteIssue(current.id);

    //navigate back to list
    this.router.navigate(['/issues']);
  }

  // format date
  formatDate(date: Date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
