import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplianceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/compliance`;

  exportUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/export`);
  }

  requestDeletion(): Observable<{ status: string; message: string; ticketId: string; requestedAt: string }> {
    return this.http.post<any>(`${this.apiUrl}/request-deletion`, {});
  }
}