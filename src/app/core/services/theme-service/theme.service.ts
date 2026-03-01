import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID, signal, computed, effect } from '@angular/core';

/**
 * @description Manages light/dark theme state using signals.
 * Persists user preference to localStorage.
 * @author Anjana E
 * @date 01-03-2026
 */

// Restrict allowed values
export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Detect platform (important if app ever uses SSR )
  private platformId = inject(PLATFORM_ID);

  // key for theme in localStorage
  private readonly STORAGE_KEY = 'beinex-theme';

  private readonly isBrowser = isPlatformBrowser(this.platformId);

  //theme state
  readonly currentTheme = signal<Theme>(this.getInitialTheme());

  //template usage cleaner
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  // change theme when signal updates
  private readonly themeEffect = effect(() => {
    const theme = this.currentTheme();
    this.applyTheme(theme);
    this.persistTheme(theme);
  });

  // initial theme - either from localStorage or default
  private getInitialTheme(): Theme {
    if (!this.isBrowser) return 'light'; // default for SSR

    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    return savedTheme === 'dark' ? 'dark' : 'light';
  }

  // apply theme
  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    document.documentElement.setAttribute('data-theme', theme);
  }

  // theme saving to localStorage
  private persistTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  //user action: to toggle theme
  toggleTheme(): void {
    this.currentTheme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }

  //controlled theme selection - future customization [ System preference detection ]
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  //accessibility - for screen readers
  get themeLabel(): string {
    return this.isDark() ? 'Switch to light theme' : 'Switch to dark theme';
  }
}
