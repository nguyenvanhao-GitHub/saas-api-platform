import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AuditLog, PageResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly apiUrl = `${environment.apiBaseUrl}/audit-logs`;

  constructor(private http: HttpClient) {}

  getAllAuditLogs(page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<AuditLog>>> {
    return this.http.get<ApiResponse<PageResponse<AuditLog>>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}
