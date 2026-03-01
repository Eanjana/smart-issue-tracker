import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { ThemeService } from '../../core/services/theme-service/theme.service';


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  //services for navbar
  private authservice = inject(AuthService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  // Accessibility label for theme toggle button
  readonly themeLabel = this.themeService.themeLabel;

  // theme toggle in nav
  toggleTheme(): void{
    this.themeService.toggleTheme();
  }

  // logout button — clears token and redirects
  logout(): void{
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
}
