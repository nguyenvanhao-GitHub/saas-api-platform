import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, AuthResponse, SocialLoginRequest, User } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;
  
  // State management using Signals
  public currentUser = signal<AuthResponse | null>(this.getStoredUser());
  public isAuthenticated = computed(() => !!this.currentUser());
  public isAdmin = computed(() => this.currentUser()?.role === 'ROLE_ADMIN');

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  register(data: { email: string; password: string; fullName: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        if (res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  socialLogin(data: SocialLoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/social-login`, data).pipe(
      tap(res => {
        if (res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const current = this.currentUser();
    const token = current?.refreshToken || current?.accessToken;
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh-token`, {
      refreshToken: token
    }).pipe(
      tap(res => {
        if (res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        error: () => {} // ignore network error on logout
      });
    }
    localStorage.removeItem('saas_auth_user');
    localStorage.removeItem('saas_token');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('saas_token');
  }

  private setSession(authData: AuthResponse): void {
    localStorage.setItem('saas_token', authData.accessToken);
    localStorage.setItem('saas_auth_user', JSON.stringify(authData));
    this.currentUser.set(authData);
  }

  private getStoredUser(): AuthResponse | null {
    const userStr = localStorage.getItem('saas_auth_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
