import { Component, effect, inject } from '@angular/core';
import { IssueService } from '../../services/issue.service';
import { IssueInterface } from '../../models/issue.interface';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * @description  Reusable create/edit issue form. Detects edit
 * mode from route :id param and pre-fills the form via effect().
 * @author Anjana E
 * @date 01-03-2026
 */

@Component({
  selector: 'app-issue-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './issue-form.html',
  styleUrl: './issue-form.scss',
})
export class IssueForm {
  private issueService = inject(IssueService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  currentIssue: IssueInterface | null = null;

  // ---------------------------
  // REACTIVE FORM
  // ---------------------------
  form = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [this.notEmptyValidator],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [this.notEmptyValidator],
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [this.notEmptyValidator],
    }),
    priority: new FormControl<'low' | 'medium' | 'high'>('low', {
      nonNullable: true,
    }),
    status: new FormControl<'open' | 'in-progress' | 'resolved'>('open', {
      nonNullable: true,
    }),
    assignedTo: new FormControl<string>('', {
      nonNullable: true,
      validators: [this.notEmptyValidator],
    }),
    dueDate: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  //to prefill form
  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    effect(() => {
      const issues = this.issueService.issues();
      const issue = issues.find((i) => i.id === Number(id));

      if (!issue) return;

      this.currentIssue = issue;

      this.form.patchValue({
        title: issue.title,
        description: issue.description,
        category: issue.category,
        priority: issue.priority,
        status: issue.status,
        assignedTo: issue.assignedTo,
        dueDate: this.formatDate(issue.dueDate),
      });
    });
  }

  // ---------------------------
  // FORMAT DATE
  // ---------------------------
  formatDate(date: Date) {
    return new Date(date).toISOString().substring(0, 10);
  }

  // ---------------------------
  // custom Validator - handle empty / spaces
  // ---------------------------
  notEmptyValidator(control: AbstractControl<string>) {
    const value = control.value ?? '';
    return value.trim().length > 0 ? null : { required: true }; //null means valid [ has value ]
  }

  // ---------------------------
  // SUBMIT FORM
  // ---------------------------
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const issue: IssueInterface = {
      id: this.currentIssue?.id ?? Date.now(),
      title: value.title,
      description: value.description,
      category: value.category,
      priority: value.priority,
      status: value.status,
      assignedTo: value.assignedTo,
      createdAt: this.currentIssue?.createdAt ?? new Date(),
      dueDate: new Date(value.dueDate!),
      resolvedAt: this.currentIssue?.resolvedAt,
    };

    //------update issue-----
    if (this.currentIssue) {
      this.issueService.updateIssue(issue);
    }
    //------create issue-----
    else {
      this.issueService.createIssue(issue);
    }

    //-----redirect after save-----
    this.router.navigate(['/issues']);
  }
}
