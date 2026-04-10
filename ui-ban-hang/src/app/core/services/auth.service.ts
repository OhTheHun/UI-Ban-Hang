import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, timeout } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { LoginRequest, AuthResponse, RegisterRequest, RegisterResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://localhost:7161/api';
  private readonly TOKEN_KEY = 'mabixi_auth_token';
  private readonly USER_KEY = 'mabixi_auth_user';
  private readonly TIMEOUT_MS = 2000; // 2 seconds timeout

  private _user = signal<User | null>(this.getStoredUser());

  currentUser = computed(() => this._user());
  isLoggedIn = computed(() => !!this._user());

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      timeout(this.TIMEOUT_MS),
      tap(response => {
        this.setSession(response, credentials);
      }),
      catchError(error => {
        const errorMsg = error.name === 'TimeoutError'
          ? 'Server is taking too long to respond. Please try again.'
          : 'Login failed. Please check your connection or credentials.';
        console.error('Login failed:', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/user/register`, userData).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(error => {
        const errorMsg = error.name === 'TimeoutError'
          ? 'Registration timed out. Please try again later.'
          : 'Registration failed.';
        console.error('Registration failed:', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(authResult: AuthResponse, credentials?: LoginRequest): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.accessToken);

    const user: User = {
      id: authResult.userId,
      email: credentials?.username || '',
      name: authResult.userId ? `User ${authResult.userId.toString().substring(0, 4)}` : 'MABIXI User',
      avatar: `https://ui-avatars.com/api/?name=User&background=f49e0b&color=fff`,
      role: authResult.role || 'Customer'
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
