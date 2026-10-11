import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CreateAlertDto, UsageAlert } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/alerts`;

  getMyAlerts(): Observable<ApiResponse<UsageAlert[]>> {
    return this.http.get<ApiResponse<UsageAlert[]>>(this.apiUrl);
  }

  createAlert(dto: CreateAlertDto): Observable<ApiResponse<UsageAlert>> {
    return this.http.post<ApiResponse<UsageAlert>>(this.apiUrl, dto);
  }

  deleteAlert(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  testAlert(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/test`, {});
  }
}