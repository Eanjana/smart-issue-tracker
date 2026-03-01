import { inject, Injectable, signal } from '@angular/core';
import { IssueInterface } from '../models/issue.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

/**
 * @description Centralized state management for issues.
 * Handles all CRUD operations against the mock REST API
 * and keeps the local signal store in sync.
 * @author Anjana E
 * @date 01-03-2026
 */

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/issues';

  //centralized state
  private _issues = signal<IssueInterface[]>([]);

  //public readonly issue state
  issues = this._issues.asReadonly();

  //initial data loading
  constructor() {
    this.loadIssues();
  }

  // -------------------------
  // Load issues from API
  // -------------------------
  private loadIssues(): void {
    this.http
      .get<IssueInterface[]>(this.apiUrl)
      .pipe(
        catchError((err) => {
          console.error('failed to load issues', err);
          return of([]);
        }),
      )
      .subscribe((data) => {
        const parsed = data.map((issue) => this.parseIssueDates(issue));
        this._issues.set(parsed);
      });
  }

  //------CRUD --------

  // -------------------------
  // Create Issue
  // -------------------------
  createIssue(issue: IssueInterface) {
    this.http
      .post<IssueInterface>(this.apiUrl, issue)
      .pipe(
        catchError((err) => {
          console.error('Failed to create issue', err);
          return of(null);
        }),
      )
      .subscribe((newIssue) => {
        if (!newIssue) return;

        // local state update instead of reload
        this._issues.update((current) => [...current, this.parseIssueDates(newIssue)]);
      });
  }

  // -------------------------
  // Update Issue
  // -------------------------
  updateIssue(updatedIssue: IssueInterface) {
    if (updatedIssue.status === 'resolved' && !updatedIssue.resolvedAt) {
      updatedIssue = {
        ...updatedIssue,
        resolvedAt: new Date(),
      };
    }

    this.http
      .put<IssueInterface>(`${this.apiUrl}/${updatedIssue.id}`, updatedIssue)
      .pipe(
        catchError((err) => {
          console.error('Failed to update issue', err);
          return of(null);
        }),
      )
      .subscribe((issue) => {
        if (!issue) return;

        //replace only changed issue
        this._issues.update((list) =>
          list.map((i) => (i.id === issue.id ? this.parseIssueDates(issue) : i)),
        );
      });
  }

  // -------------------------
  // Delete Issue
  // -------------------------
  deleteIssue(id: number | string) {
    this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((err) => {
          console.error('Failed to delete issue', err);
          return of(null);
        }),
      )
      .subscribe(() => {
        // remove locally
        this._issues.update((list) => list.filter((issue) => issue.id !== id));
      });
  }

  // -------------------------
  // Helper: convert API dates
  // -------------------------
  private parseIssueDates(issue: IssueInterface): IssueInterface {
    return {
      ...issue,
      createdAt: new Date(issue.createdAt),
      dueDate: new Date(issue.dueDate),
      resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : undefined,
    };
  }
}
