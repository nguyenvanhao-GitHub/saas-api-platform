import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CreateFirewallDto, IpFirewallRule } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FirewallService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/firewall`;

  getAllRules(): Observable<ApiResponse<IpFirewallRule[]>> {
    return this.http.get<ApiResponse<IpFirewallRule[]>>(this.apiUrl);
  }

  createRule(dto: CreateFirewallDto): Observable<ApiResponse<IpFirewallRule>> {
    return this.http.post<ApiResponse<IpFirewallRule>>(this.apiUrl, dto);
  }

  toggleRule(id: string): Observable<ApiResponse<IpFirewallRule>> {
    return this.http.patch<ApiResponse<IpFirewallRule>>(`${this.apiUrl}/${id}/toggle`, {});
  }

  deleteRule(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}