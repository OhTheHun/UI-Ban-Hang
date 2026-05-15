import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

import {
  LoginRequest,
  AuthResponse,
  RegisterRequest,
  RegisterResponse,
  User
} from '../models/auth.model';

import { ConfigService } from '../../../core/services/config.service';
import { TokenService } from '../../../core/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TIMEOUT_MS = 4000;

  private _user = signal<User | null>(null);

  currentUser = computed(() => this._user());

  isLoggedIn = computed(() => !!this._user());

  hasRole(role: string): boolean {
    return this._user()?.role === role;
  }

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private router: Router,
    private tokenService: TokenService
  ) {
    const storedUser = this.tokenService.getStoredUser();

    if (storedUser) {
      this._user.set(storedUser);

      if (this.tokenService.getToken()) {
        this.refreshProfile(storedUser.id);
      }
    }
  }

  refreshProfile(userId: string): void {
    this.http
      .get<any>(this.config.getEndpoint(`user/${userId}`))
      .subscribe({
        next: (res) => {
          const profile = res?.data || res?.user || res;

          const currentUser = this._user();

          if (currentUser && profile) {
            const realName =
              profile.fullName ||
              profile.fullname ||
              profile.full_name ||
              currentUser.fullname;

            const updatedUser: User = {
              ...currentUser,
              fullname: realName,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                realName
              )}&background=0071bb&color=fff&size=128`,
              phone:
                profile.phone ||
                profile.phoneNumber ||
                currentUser.phone,
              address:
                profile.address ||
                currentUser.address
            };

            this._user.set(updatedUser);

            this.tokenService.setStoredUser(updatedUser);
          }
        },

        error: (err) => {
          console.error('Failed to fetch profile:', err);
        }
      });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        this.config.getEndpoint('auth/login'),
        credentials
      )
      .pipe(
        timeout(this.TIMEOUT_MS),

        tap((response) => {
          this.setSession(response, credentials);
        }),

        catchError((error) => {
          const errorMsg =
            error.name === 'TimeoutError'
              ? 'Server is taking too long to respond. Please try again.'
              : 'Login failed. Please check your connection or credentials.';

          console.error('Login failed:', errorMsg);

          return throwError(() => new Error(errorMsg));
        })
      );
  }

  register(
    userData: RegisterRequest
  ): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(
        this.config.getEndpoint('user/register'),
        userData
      )
      .pipe(
        timeout(this.TIMEOUT_MS),

        catchError((error) => {
          const errorMsg =
            error.name === 'TimeoutError'
              ? 'Registration timed out. Please try again later.'
              : 'Registration failed.';

          console.error('Registration failed:', errorMsg);

          return throwError(() => new Error(errorMsg));
        })
      );
  }

  // Forgot Password & Reset Password
  forgotPassword(email: string) {
    return this.http.post(this.config.getEndpoint('auth/forgot-password'), { email });
  }

  resetPassword(data: any) {
    return this.http.post(this.config.getEndpoint('auth/reset-password'), data);
  }

  logoutOnly(): void {
    this.tokenService.clear();
    this._user.set(null);
  }

  logout(): void {
    this.logoutOnly();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  private setSession(
    res: any,
    credentials?: LoginRequest
  ): void {

    const authResult = res?.data || res?.user || res;

    console.log('LOGIN RESPONSE:', authResult);

    if (authResult.accessToken) {
      this.tokenService.setToken(authResult.accessToken);
    }

    const realName =
      authResult.fullName ||
      authResult.fullname ||
      authResult.name ||
      authResult.userName ||
      authResult.username ||
      authResult.email?.split('@')[0] ||
      credentials?.username?.split('@')[0] ||
      'User';

    const realEmail =
      authResult.email ||
      authResult.userName ||
      credentials?.username ||
      '';

    const user: User = {
      id: authResult.userId || authResult.id,

      email: realEmail,

      fullname: realName,

      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        realName
      )}&background=0071bb&color=fff&size=128`,

      role:
        authResult.role ||
        authResult.Role ||
        authResult.roleName ||
        authResult.userRole ||
        'Customer'
    };

    this._user.set(user);

    this.tokenService.setStoredUser(user);

    if (user.id) {
      this.refreshProfile(user.id);
    }
  }
}