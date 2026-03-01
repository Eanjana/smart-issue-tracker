import { Injectable, signal, effect, computed } from '@angular/core';

/**
 * @description Handles user authentication, session management,
 * and token storage for the Beinex Issue Tracker.
 * @author Anjana E
 * @date 01-03-2026
 */

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // mock stored credentials(email & password)
  private readonly storedUser = {
    email: 'admin@example.com',
    password: 'Admin123',
  };

  //Auth state signal
  private isLoggedIn = signal<boolean>(false);

  readonly isAuthenticated = computed(() => this.isLoggedIn());

  constructor() {
    this.restoreSession(); //user remains logged in after refresh
  }

  //----------------------------------
  //login - with stored credential
  //----------------------------------

  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase(); //updating email without space and uppercase's before comparing
    const isValid =
      normalizedEmail === this.storedUser.email && password === this.storedUser.password;

    if (isValid) {
      //store mock JWT token
      localStorage.setItem('token', 'mock-jwt-token');
      this.isLoggedIn.set(true);
    } else {
      this.isLoggedIn.set(false);
    }

    return isValid;
  }

  //----------------------------------
  //logout
  //----------------------------------
  logout(): void {
    //remove token
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
  }

  //Restore session (login) on refresh
  private restoreSession(): void {
    const token = localStorage.getItem('token');

    //if token exists -> user considered logged in
    if (token) {
      this.isLoggedIn.set(true);
    }
  }
}
