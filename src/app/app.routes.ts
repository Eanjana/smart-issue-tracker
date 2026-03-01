import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },

      // LIST PAGE
      {
        path: 'issues',
        loadComponent: () =>
          import('./features/issues/pages/issue-list/issue-list').then((m) => m.IssueList),
      },

      // CREATE ISSUE
      {
        path: 'issue/new',
        loadComponent: () =>
          import('./features/issues/components/issue-form/issue-form').then((m) => m.IssueForm),
      },

      // ISSUE DETAILS
      {
        path: 'issues/:id',
        loadComponent: () =>
          import('./features/issues/pages/issue-details/issue-details').then((m) => m.IssueDetails)
      },

      // EDIT ISSUE
      {
        path: 'issues/:id/edit',
        loadComponent: () =>
          import('./features/issues/components/issue-form/issue-form').then((m) => m.IssueForm),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
