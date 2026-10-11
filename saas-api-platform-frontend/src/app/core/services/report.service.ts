import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboard, ApiResponse, DeveloperDashboard } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly apiUrl = `${environment.apiBaseUrl}/reports`;

  constructor(private http: HttpClient) {}

  getAdminDashboard(): Observable<ApiResponse<AdminDashboard>> {
    return this.http.get<ApiResponse<AdminDashboard>>(`${this.apiUrl}/admin/dashboard`);
  }

  getDeveloperDashboard(): Observable<ApiResponse<DeveloperDashboard>> {
    return this.http.get<ApiResponse<DeveloperDashboard>>(`${this.apiUrl}/developer/dashboard`);
  }
}
