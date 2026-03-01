import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth-service/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../../core/services/theme-service/theme.service';

/**
 * @description  Login page component. Handles form validation,
 * credential submission, and theme toggling.
 * @author Anjana E
 * @date 01-03-2026
 */

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  //login error
  loginError = signal(false);

  // accessibility label for theme toggle
  readonly themeLabel = this.themeService.themeLabel;

  //login form with validation
  loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)],
    ],
    password: ['', [Validators.required, this.passwordValidator]],
  });

  //login error handling
  constructor() {
    //auto clear login error when user edits or types
    this.loginForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.loginError.set(false);
    });
  }

  //custom strong password validator
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null; // .required handles empty case
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    return passwordRegex.test(value) ? null : { weakPassword: true };
  }

  onSubmit(): void {
    // Show all validation errors
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    const success = this.authService.login(email!, password!);

    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.loginError.set(true);
    }
  }

  //theme toggle for user action
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
